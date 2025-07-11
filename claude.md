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
