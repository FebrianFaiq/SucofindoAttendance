import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:camera/camera.dart';
import '../theme/app_colors.dart';

/// Reusable inline camera widget that shows the camera preview
/// directly inside the page (like the web version).
///
/// States:
///  1. Idle       — shows placeholder + "Buka Kamera" button
///  2. Previewing — live camera feed + "Ambil Foto" button
///  3. Captured   — photo preview + "Ambil Ulang" button
class InlineCameraWidget extends StatefulWidget {
  /// Called when a photo is successfully captured.
  final ValueChanged<XFile> onPhotoCaptured;

  /// Called when the captured photo is cleared (retake).
  final VoidCallback? onPhotoCleared;

  const InlineCameraWidget({
    super.key,
    required this.onPhotoCaptured,
    this.onPhotoCleared,
  });

  @override
  State<InlineCameraWidget> createState() => _InlineCameraWidgetState();
}

class _InlineCameraWidgetState extends State<InlineCameraWidget>
    with WidgetsBindingObserver {
  CameraController? _controller;
  List<CameraDescription>? _cameras;
  bool _isInitializing = false;
  bool _isCameraActive = false;
  XFile? _capturedPhoto;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _controller?.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    // Handle app lifecycle to properly manage camera resources
    if (_controller == null || !_controller!.value.isInitialized) return;

    if (state == AppLifecycleState.inactive) {
      _controller?.dispose();
    } else if (state == AppLifecycleState.resumed) {
      if (_isCameraActive && _capturedPhoto == null) {
        _initCamera();
      }
    }
  }

  Future<void> _initCamera() async {
    setState(() {
      _isInitializing = true;
      _errorMessage = null;
    });

    try {
      _cameras = await availableCameras();
      if (_cameras == null || _cameras!.isEmpty) {
        setState(() {
          _errorMessage = 'Tidak ada kamera yang tersedia.';
          _isInitializing = false;
        });
        return;
      }

      // Prefer front camera for face verification
      final frontCamera = _cameras!.firstWhere(
        (cam) => cam.lensDirection == CameraLensDirection.front,
        orElse: () => _cameras!.first,
      );

      _controller = CameraController(
        frontCamera,
        ResolutionPreset.medium,
        enableAudio: false,
        imageFormatGroup: ImageFormatGroup.jpeg,
      );

      await _controller!.initialize();

      if (mounted) {
        setState(() {
          _isCameraActive = true;
          _isInitializing = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Gagal membuka kamera: $e';
          _isInitializing = false;
        });
      }
    }
  }

  Future<void> _capturePhoto() async {
    if (_controller == null || !_controller!.value.isInitialized) return;
    if (_controller!.value.isTakingPicture) return;

    try {
      final photo = await _controller!.takePicture();

      // Dispose camera after capture
      await _controller?.dispose();

      if (mounted) {
        setState(() {
          _capturedPhoto = photo;
          _isCameraActive = false;
        });
        widget.onPhotoCaptured(photo);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal mengambil foto: $e')),
        );
      }
    }
  }

  void _retakePhoto() {
    setState(() {
      _capturedPhoto = null;
    });
    widget.onPhotoCleared?.call();
    _initCamera();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Verifikasi Wajah',
          style: GoogleFonts.mulish(
            fontSize: 13,
            fontWeight: FontWeight.w800,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 12),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border.withOpacity(0.5)),
          ),
          child: Column(
            children: [
              // Camera / Photo area
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  height: 280,
                  width: double.infinity,
                  color: AppColors.primary.withOpacity(0.05),
                  child: _buildCameraContent(),
                ),
              ),

              // Helper text
              if (_capturedPhoto == null && !_isCameraActive) ...[
                const SizedBox(height: 16),
                Text(
                  'Posisikan wajah Anda di dalam bingkai untuk verifikasi biometrik otomatis.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.mulish(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                    height: 1.5,
                  ),
                ),
              ],

              const SizedBox(height: 16),

              // Action button
              _buildActionButton(),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCameraContent() {
    // State 3: Photo captured — show preview
    if (_capturedPhoto != null) {
      return Stack(
        fit: StackFit.expand,
        children: [
          Image.file(
            File(_capturedPhoto!.path),
            fit: BoxFit.cover,
          ),
          // Gradient overlay at bottom
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                  colors: [
                    Colors.black.withOpacity(0.6),
                    Colors.transparent,
                  ],
                ),
              ),
              child: Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.5),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.check_circle,
                        color: AppColors.success,
                        size: 14,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        'Foto berhasil diambil',
                        style: GoogleFonts.mulish(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      );
    }

    // State 2: Camera active — live preview
    if (_isCameraActive &&
        _controller != null &&
        _controller!.value.isInitialized) {
      return Stack(
        fit: StackFit.expand,
        children: [
          // Camera preview
          FittedBox(
            fit: BoxFit.cover,
            clipBehavior: Clip.hardEdge,
            child: SizedBox(
              width: _controller!.value.previewSize?.height ?? 1,
              height: _controller!.value.previewSize?.width ?? 1,
              child: CameraPreview(_controller!),
            ),
          ),
          // Face guide overlay (circular border)
          Center(
            child: Container(
              width: 180,
              height: 180,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: Colors.white.withOpacity(0.6),
                  width: 2,
                ),
              ),
            ),
          ),
          // Dark corners outside the circle
          CustomPaint(
            size: Size.infinite,
            painter: _FaceGuidePainter(),
          ),
        ],
      );
    }

    // Loading state
    if (_isInitializing) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(strokeWidth: 3),
            SizedBox(height: 12),
            Text('Memuat kamera...'),
          ],
        ),
      );
    }

    // Error state
    if (_errorMessage != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 40, color: AppColors.danger),
              const SizedBox(height: 12),
              Text(
                _errorMessage!,
                textAlign: TextAlign.center,
                style: GoogleFonts.mulish(
                  fontSize: 12,
                  color: AppColors.danger,
                ),
              ),
            ],
          ),
        ),
      );
    }

    // State 1: Idle — placeholder
    return Center(
      child: Container(
        width: 80,
        height: 80,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: AppColors.primary.withOpacity(0.3),
            width: 1.5,
          ),
        ),
        child: Icon(
          Icons.face,
          size: 40,
          color: AppColors.textSecondary.withOpacity(0.8),
        ),
      ),
    );
  }

  Widget _buildActionButton() {
    // Captured — Ambil Ulang
    if (_capturedPhoto != null) {
      return SizedBox(
        width: double.infinity,
        child: ElevatedButton.icon(
          onPressed: _retakePhoto,
          icon: const Icon(Icons.camera_alt_outlined, size: 18),
          label: Text(
            'Ambil Ulang',
            style: GoogleFonts.mulish(fontWeight: FontWeight.w700),
          ),
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFE2E8F0),
            foregroundColor: AppColors.textSecondary,
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            padding: const EdgeInsets.symmetric(vertical: 12),
          ),
        ),
      );
    }

    // Camera active — Ambil Foto
    if (_isCameraActive) {
      return SizedBox(
        width: double.infinity,
        child: ElevatedButton.icon(
          onPressed: _capturePhoto,
          icon: const Icon(Icons.camera, size: 18, color: Colors.white),
          label: Text(
            'Ambil Foto',
            style: GoogleFonts.mulish(
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
          ),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primaryDark,
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            padding: const EdgeInsets.symmetric(vertical: 12),
          ),
        ),
      );
    }

    // Idle — Buka Kamera
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: _isInitializing ? null : _initCamera,
        icon: _isInitializing
            ? const SizedBox(
                width: 18,
                height: 18,
                child: CircularProgressIndicator(strokeWidth: 2),
              )
            : const Icon(Icons.camera_alt_outlined, size: 18),
        label: Text(
          _isInitializing ? 'Memuat...' : 'Buka Kamera',
          style: GoogleFonts.mulish(fontWeight: FontWeight.w700),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFFE2E8F0),
          foregroundColor: AppColors.textSecondary,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          padding: const EdgeInsets.symmetric(vertical: 12),
        ),
      ),
    );
  }
}

/// Painter that draws a semi-transparent overlay with a circular cutout
/// to guide the user's face placement.
class _FaceGuidePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = Colors.black.withOpacity(0.4);
    final circlePath = Path()
      ..addOval(Rect.fromCenter(
        center: Offset(size.width / 2, size.height / 2),
        width: 180,
        height: 180,
      ));
    final fullPath = Path()
      ..addRect(Rect.fromLTWH(0, 0, size.width, size.height));
    final overlayPath =
        Path.combine(PathOperation.difference, fullPath, circlePath);
    canvas.drawPath(overlayPath, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
