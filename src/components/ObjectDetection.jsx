import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import * as tmImage from '@teachablemachine/image';
import '@tensorflow/tfjs';
import Pako from 'pako';
import ReportCamOn from './ReportCamOn';
import Loading from '../view/Loading';
import { Box, Button } from '@mui/material';
import CameraIcon from '@mui/icons-material/Camera';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ObjectDetection.css';

const ObjectDetection = () => {
	const Navigate = useNavigate();
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const [modelStart, setModelStart] = useState(false);
	const [capturedImage, setCapturedImage] = useState(null);
	const [objectInCamera, setObjectInCamera] = useState('');
	const [confirm, setConfirm] = useState(false);
	const [model, setModel] = useState(null);
	const [labelContainer, setLabelContainer] = useState(null);
	const [maxPredictions, setMaxPredictions] = useState(0);
	const labelContainerRef = useRef(null);
	const [item, setItem] = useState('');
	const [selectedFile, setselectedFile] = useState(null);

	console.log(labelContainer, item, selectedFile, setMaxPredictions);

	const URL = 'https://teachablemachine.withgoogle.com/models/Fnqyc2KVZ/';
	useEffect(() => {
		const runObjectDetection = async () => {
			try {
				const modelURL = URL + 'model.json';
				const metadataURL = URL + 'metadata.json';

				const loadedModel = await tmImage.load(modelURL, metadataURL);
				setModel(loadedModel);
			} catch (error) {
				console.error('Error loading model:', error);
			}
			setModelStart(true);

			if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
				try {
					const stream = await navigator.mediaDevices.getUserMedia({
						video: { facingMode: 'environment' },
					});

					videoRef.current.srcObject = stream;
				} catch (error) {
					Navigate('/device-list');
				}
			}
		};

		runObjectDetection();
	}, [URL]);

	useEffect(() => {
		if (labelContainerRef.current) {
			setLabelContainer(labelContainerRef.current);
			for (let i = 0; i < maxPredictions; i++) {
				labelContainerRef.current.appendChild(document.createElement('div'));
			}
		}
	}, [maxPredictions]);

	const compressImage = async (imageDataUrl, maxWidth, maxHeight) => {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.src = imageDataUrl;

			image.onload = () => {
				const canvas = document.createElement('canvas');
				const context = canvas.getContext('2d');

				let width = image.width;
				let height = image.height;

				if (width > maxWidth) {
					height *= maxWidth / width;
					width = maxWidth;
				}

				if (height > maxHeight) {
					width *= maxHeight / height;
					height = maxHeight;
				}

				canvas.width = width;
				canvas.height = height;

				context.drawImage(image, 0, 0, width, height);

				canvas.toBlob(
					compressedBlob => {
						const reader = new FileReader();
						reader.readAsDataURL(compressedBlob);
						reader.onloadend = () => {
							const compressedImageDataUrl = reader.result;
							resolve(compressedImageDataUrl);
						};
					},
					'image/jpeg',
					0.9,
				);
			};

			image.onerror = error => {
				reject(error);
			};
		});
	};

	const captureImage = async () => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');

		canvas.width = videoRef.current.videoWidth;
		canvas.height = videoRef.current.videoHeight;

		context.drawImage(
			videoRef.current,
			0,
			0,
			videoRef.current.videoWidth,
			videoRef.current.videoHeight,
		);

		const image = new Image();
		image.src = canvas.toDataURL();

		const compressedImageDataUrl = await compressImage(image.src, 300, 300);

		setCapturedImage(compressedImageDataUrl);

		if (model) {
			const prediction = await model.predict(image);

			let maxProbability = 0;
			let detectedClass = '';
			prediction.forEach(classPrediction => {
				if (classPrediction.probability > maxProbability) {
					maxProbability = classPrediction.probability;
					detectedClass = classPrediction.className;
				}
			});

			setObjectInCamera(detectedClass);
		}
	};

	const handleCaptureImage = () => {
		captureImage();
		setselectedFile(capturedImage);
	};

	const handleScanAgain = () => {
		setCapturedImage(null);
		setObjectInCamera('');
		restartVideo();
	};
	const restartVideo = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'environment' },
			});

			videoRef.current.srcObject = stream;
		} catch (error) {
			Navigate('/device-list');
		}
	};

	const handleConfirmObject = () => {
		setItem(objectInCamera);
		setselectedFile(capturedImage);
		setConfirm(!confirm);
	};

	if (capturedImage) {
		const urlCompressed = Pako.gzip(capturedImage, { to: 'string' });
		console.log(urlCompressed);
	}

	return (
		<>
			{!modelStart ? (
				<Loading />
			) : (
				<>
					{!confirm ? (
						<div title='Scanner'>
							<Box className='container-title'>
								<h3 className='title'>Camera</h3>
							</Box>
							<Box className='camera'>
								{capturedImage ? (
									<Box className='container-camera-style'>
										<img
											src={capturedImage}
											className='image-detected'
											alt='Uploaded File'
										/>

										<Box className='container-button'>
											<Button
												onClick={handleConfirmObject}
												type={'success'}
												props={{ width: '100%' }}
											>
												<CheckCircleIcon className='icon' />
											</Button>

											<div className='text-detected'>
												{objectInCamera ? `Detect a ${objectInCamera}` : ''}
											</div>
											<Button
												type={'error'}
												onClick={handleScanAgain}
												width='100%'
											>
												<CameraswitchIcon className='icon' />
											</Button>
										</Box>
									</Box>
								) : (
									<Box className='container-camera-style'>
										<video
											ref={videoRef}
											style={{ width: '100%' }}
											autoPlay
										></video>
										<Box
											position='relative'
											display='flex'
											flexDirection='column'
											alignItems='center'
											margin={'0 auto'}
											width='75%'
										>
											<Box
												position='absolute'
												top='-80px'
												left='0'
												right='0'
												bottom='0'
												display='flex'
												justifyContent='center'
												alignItems='center'
											>
												<Button
													type={'success'}
													onClick={handleCaptureImage}
													variant='contained'
													style={{
														borderRadius: '50%',
														minWidth: '60px',
														height: '60px',
														padding: '6px',
														background: 'rgb(180 183 187)',
													}}
												>
													<CameraIcon style={{ fontSize: '40px' }} />
												</Button>
											</Box>
										</Box>
									</Box>
								)}

								<canvas
									ref={canvasRef}
									style={{ display: 'none' }}
									width={videoRef.current ? videoRef.current.videoWidth : 640}
									height={videoRef.current ? videoRef.current.videoHeight : 480}
								></canvas>
							</Box>
						</div>
					) : (
						<ReportCamOn
							objectInCamera={objectInCamera}
							capturedImage={capturedImage}
							handleConfirmObject={handleConfirmObject}
						/>
					)}
				</>
			)}
		</>
	);
};
export default ObjectDetection;
