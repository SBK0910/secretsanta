"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
	const [showForm, setShowForm] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	const handleVideoEnd = () => {
		setShowForm(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate Indian phone number (10 digits)
		const phoneRegex = /^[6-9]\d{9}$/;
		if (!phoneRegex.test(phoneNumber)) {
			alert("Please enter a valid 10-digit Indian phone number");
			return;
		}

		setLoading(true);

		try {
			const response = await fetch("/api/send-voucher", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ phoneNumber }),
			});

			if (response.ok) {
				setSubmitted(true);
			} else {
				alert("Something went wrong. Please try again.");
			}
		} catch (error) {
			alert("Error submitting. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-red-900 via-green-900 to-red-900 p-4">
			{/* Animated Christmas Background */}
			<div className="absolute inset-0 overflow-hidden">
				{/* Snowflakes */}
				<div className="snowflake absolute text-white text-2xl animate-[fall_10s_linear_infinite]" style={{ left: '10%', animationDelay: '0s' }}>❄</div>
				<div className="snowflake absolute text-white text-3xl animate-[fall_12s_linear_infinite]" style={{ left: '20%', animationDelay: '2s' }}>❄</div>
				<div className="snowflake absolute text-white text-2xl animate-[fall_15s_linear_infinite]" style={{ left: '30%', animationDelay: '4s' }}>❄</div>
				<div className="snowflake absolute text-white text-4xl animate-[fall_11s_linear_infinite]" style={{ left: '40%', animationDelay: '1s' }}>❄</div>
				<div className="snowflake absolute text-white text-2xl animate-[fall_13s_linear_infinite]" style={{ left: '50%', animationDelay: '3s' }}>❄</div>
				<div className="snowflake absolute text-white text-3xl animate-[fall_14s_linear_infinite]" style={{ left: '60%', animationDelay: '5s' }}>❄</div>
				<div className="snowflake absolute text-white text-2xl animate-[fall_16s_linear_infinite]" style={{ left: '70%', animationDelay: '2s' }}>❄</div>
				<div className="snowflake absolute text-white text-4xl animate-[fall_12s_linear_infinite]" style={{ left: '80%', animationDelay: '4s' }}>❄</div>
				<div className="snowflake absolute text-white text-3xl animate-[fall_15s_linear_infinite]" style={{ left: '90%', animationDelay: '6s' }}>❄</div>

				{/* Christmas ornaments */}
				<div className="absolute top-10 left-5 text-6xl animate-pulse">🎄</div>
				<div className="absolute top-20 right-10 text-5xl animate-bounce" style={{ animationDuration: '3s' }}>⭐</div>
				<div className="absolute bottom-20 left-10 text-5xl animate-pulse" style={{ animationDelay: '1s' }}>🎁</div>
				<div className="absolute bottom-10 right-20 text-6xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '2s' }}>🎄</div>
				<div className="absolute top-1/3 left-20 text-4xl opacity-50">🔔</div>
				<div className="absolute top-2/3 right-10 text-4xl opacity-50">🎅</div>
			</div>

			<main className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center gap-8">
				{/* Video Player */}
				{!submitted && (
					<Card className="w-full overflow-hidden shadow-2xl">
						<CardContent className="p-0">
							<video
								ref={videoRef}
								className="w-full aspect-video bg-black"
								autoPlay
								playsInline
								onEnded={handleVideoEnd}
								controlsList="nodownload nofullscreen noremoteplayback"
								disablePictureInPicture
								onContextMenu={(e) => e.preventDefault()}
							>
								<source src="/jingle-bells.mp4" type="video/mp4" />
								Your browser does not support the video tag.
							</video>
						</CardContent>
					</Card>
				)}

				{/* Phone Number Form */}
				{showForm && !submitted && (
					<Card className="w-full max-w-md shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
						<CardContent className="p-6">
							<div className="space-y-4">
								<div className="text-center space-y-2">
									<h1 className="text-2xl font-bold text-green-700">
										🎄 Congratulations! 🎄
									</h1>
									<p className="text-gray-600">
										Enter your phone number to receive your ₹1000 Amazon voucher!
									</p>
								</div>

								<form onSubmit={handleSubmit} className="space-y-4">
									<div>
										<Input
											type="tel"
											placeholder="Enter 10-digit phone number"
											value={phoneNumber}
											onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
											maxLength={10}
											className="text-lg"
											required
										/>
									</div>

									<Button
										type="submit"
										className="w-full bg-green-600 hover:bg-green-700 text-white"
										disabled={loading}
									>
										{loading ? "Sending..." : "Claim My Voucher 🎁"}
									</Button>
								</form>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Success Message */}
				{submitted && (
					<Card className="w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-500">
						<CardContent className="p-8 text-center space-y-4">
							<div className="text-6xl">🎉</div>
							<h1 className="text-3xl font-bold text-green-700">
								Success!
							</h1>
							<p className="text-lg text-gray-600">
								Your ₹1000 Amazon voucher has been sent to your phone number!
							</p>
							<p className="text-sm text-gray-500">
								Please check your SMS/Email for the voucher code.
							</p>
						</CardContent>
					</Card>
				)}
			</main>
		</div>
	);
}
