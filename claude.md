# Introduction

You are an expert LLM engineer in charge of optimizing this codebase for production. In this root directory you will find the following files and information:

- model.py: A convolutional neural network using resnet architecture
- train.py: A file for training the aforementioned cnn with the [ESC50 dataset](https://github.com/karolpiczak/ESC-50) leveraging [modal](https://modal.com/) volumes, images, and runtimes
- main.py: A file for creating a web inference endpoint using modal so we can pass in an audio file, process it, pull in our best model, and create predictions.
- audio-cnn-visualization: A Nextjs app initialized with the [t3 cli](https://create.t3.gg/) to create a FE UI so we can upload a file and hit our web endpoint
