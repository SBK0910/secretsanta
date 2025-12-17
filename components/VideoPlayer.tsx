"use client";

import React, { useRef, useState, useEffect } from "react";

interface VideoPlayerProps {
	src: string;
	onEnded?: () => void;
	className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, onEnded, className = "" }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const video = videoRef.current;

		const handleCanPlayThrough = () => {
			setIsLoaded(true);
			if (video) {
				video.play().catch((error) => {
					console.error("Autoplay failed:", error);
				});
			}
		};

		if (video) {
			video.addEventListener("canplaythrough", handleCanPlayThrough);
		}

		return () => {
			if (video) {
				video.removeEventListener("canplaythrough", handleCanPlayThrough);
			}
		};
	}, [src]);

	return (
		<div className="w-full">
			{!isLoaded && (
				<div className="flex items-center justify-center p-16">
					<div className="flex flex-col items-center gap-4">
						<div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
						<p className="sm:text-base text-gray-600">Loading video...</p>
					</div>
				</div>
			)}
			<video
				ref={videoRef}
				src={src}
				className={`w-full h-auto rounded-3xl shadow-2xl ${!isLoaded ? "hidden" : ""} ${className}`}
				playsInline
				onEnded={onEnded}
				controlsList="nodownload nofullscreen noremoteplayback"
				disablePictureInPicture
				onContextMenu={(e) => e.preventDefault()}
			>
				<source src={src} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</div>
	);
};

export default VideoPlayer;
