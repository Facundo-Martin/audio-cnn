# Introduction

You are an expert LLM engineer in charge of optimizing this codebase for production. This is an audio classification system using CNNs trained on the ESC-50 environmental sound dataset.

## Project Structure

### Backend (Python/PyTorch/Modal)

- **model.py**: ResNet-based CNN architecture (`audioCNN` class) for audio classification with feature map visualization support
- **train.py**: Training pipeline using Modal cloud infrastructure, ESC-50 dataset, tensorboard logging, and model checkpointing
- **main.py**: Modal web inference endpoint with FastAPI for audio file upload, preprocessing, and prediction
- **requirements.txt**: Python dependencies (torch, torchaudio, librosa, fastapi, etc.)
- **tensorboard_logs/**: Training logs and metrics from multiple runs

### Frontend (Next.js/TypeScript/Tailwind)

- **audio-cnn-visualization/**: T3 stack app with:
  - React components for audio visualization (waveform, feature maps)
  - UI components using Radix UI and Tailwind CSS
  - File upload interface for inference endpoint integration
  - TypeScript configuration with strict type checking

### Data

- **birds.wav**: Sample audio file for testing
- **ESC-50 dataset**: 50 classes of environmental sounds (downloaded during training)

## Technical Details

- **Architecture**: ResNet-based CNN with mel spectrogram preprocessing (44.1kHz, 128 mel bins)
- **Training**: Modal cloud platform with GPU acceleration and volume persistence
- **Inference**: Web endpoint with base64 audio upload and JSON response
- **Frontend**: Modern React with server-side rendering and component library

## Commands

- Frontend dev: `cd audio-cnn-visualization && pnpm dev`
- Frontend build: `cd audio-cnn-visualization && pnpm build`
- Type check: `cd audio-cnn-visualization && pnpm typecheck`
- Lint: `cd audio-cnn-visualization && pnpm lint`

## Production Readiness Plan

### **EASY**

- [x] Setup Claude with claude.md
- [ ] Add Python static typing with mypy and pydantic - Implement comprehensive type hints across model.py, train.py, main.py
- [ ] Refactor Next.js frontend to use server actions - Convert client-side API calls to server actions for better performance
- [ ] Add environment configuration management - Implement proper .env handling and config validation
- [ ] Implement basic error handling and logging - Add structured logging with Python's logging module
- [ ] Add input validation on frontend - Client-side validation before API calls
- [ ] Cleanup frontend code - Remove unused imports, standardize naming conventions

### **MEDIUM**

- [ ] Implement automated type sharing between FastAPI and Next.js - Use OpenAPI schema generation with @hey-api/openapi-ts
- [ ] Add comprehensive testing suite - Unit tests for model components, integration tests for API endpoints
- [ ] Optimize mel spectrogram preprocessing - Research-backed parameter tuning (n_mels=64→128, hop_length optimization)
- [ ] Implement proper CI/CD pipeline - GitHub Actions for testing, type checking, and deployment
- [ ] Add model versioning and artifact management - Version models with timestamps and performance metadata
- [ ] Implement caching strategies - Redis for model caching, frontend response caching
- [ ] Add monitoring and observability - Health checks, metrics collection, performance monitoring

### **HARD**

- [ ] Migrate from TensorBoard to Weights & Biases - Better experiment tracking, team collaboration, and scalability
- [ ] Implement ResNet with attention mechanisms - Research shows 93.2% vs 82.87% accuracy improvement
- [ ] Add data augmentation pipeline - Time stretching, pitch shifting, noise injection for audio robustness
- [ ] Optimize model architecture for production - Model quantization, pruning, ONNX export for faster inference
- [ ] Implement real-time audio processing - WebRTC for live audio classification
- [ ] Add comprehensive dataset management - Dataset versioning, validation, and distribution strategies
- [ ] Create W&B model registry integration - Pull training reports and metrics into Next.js dashboard

### **HARDCORE**

- [ ] Implement multi-modal architecture - Combine audio with metadata (duration, file format) for enhanced accuracy
- [ ] Add federated learning capabilities - Allow model improvement without centralizing sensitive audio data
- [ ] Implement custom ResNet variants - EfficientNet-Audio, AudioSet-trained models, transformer-based architectures
- [ ] Build MLOps pipeline with automated retraining - Trigger retraining based on performance degradation
- [ ] Add explainable AI features - Attention visualization, SHAP values for audio classification decisions
- [ ] Implement edge deployment - TensorRT optimization, mobile inference, WebAssembly deployment
- [ ] Create multi-tenant SaaS architecture - User management, billing, resource isolation
