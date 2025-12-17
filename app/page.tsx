"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import VideoPlayer from "@/components/VideoPlayer";

type Step = "initial" | "video" | "form" | "success";

export default function Home() {
	const [step, setStep] = useState<Step>("initial");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [loading, setLoading] = useState(false);

	const handleClaimClick = () => {
		setStep("video");
	};

	const handleVideoEnd = () => {
		setStep("form");
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
				setStep("success");
			} else {
				alert("Something went wrong. Please try again.");
			}
		} catch {
			alert("Error submitting. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-linear-to-br from-red-600 via-white to-red-700 p-4">
			{/* Santa Image - fixed position bottom left, non-colliding */}
			<div className="fixed bottom-1 left-1 z-0 pointer-events-none select-none">
				<Image
					src="/santa.png"
					alt="Santa Claus"
					width={300}
					height={300}
					className="drop-shadow-2xl object-contain w-20 sm:w-32 md:w-40"
					style={{
						mixBlendMode: 'multiply',
						filter: 'drop-shadow(0 20px 25px rgb(0 0 0 / 0.15))'
					}}
					priority
					unoptimized
				/>
			</div>

			{/* Animated Christmas Background */}
			<div className="absolute inset-0 overflow-hidden">
				{/* Snowflakes */}
				<div className="snowflake absolute text-red-200 sm:text-base md:text-2xl animate-[fall_10s_linear_infinite]" style={{ left: '10%', animationDelay: '0s' }}>❄</div>
				<div className="snowflake absolute text-white sm:text-base md:text-3xl animate-[fall_12s_linear_infinite]" style={{ left: '20%', animationDelay: '2s' }}>❄</div>
				<div className="snowflake absolute text-white sm:text-base md:text-4xl animate-[fall_11s_linear_infinite]" style={{ left: '40%', animationDelay: '1s' }}>❄</div>
				<div className="snowflake absolute text-white sm:text-base md:text-3xl animate-[fall_14s_linear_infinite]" style={{ left: '60%', animationDelay: '5s' }}>❄</div>
				<div className="snowflake absolute text-white sm:text-base md:text-4xl animate-[fall_12s_linear_infinite]" style={{ left: '80%', animationDelay: '4s' }}>❄</div>

				{/* Santa and Christmas decorations */}
				<div className="absolute top-5 right-5 text-3xl sm:text-5xl md:text-6xl animate-pulse">🎅</div>
				<div className="absolute bottom-20 right-5 text-3xl sm:text-5xl md:text-6xl animate-pulse" style={{ animationDelay: '2s' }}>🎅</div>
				<div className="hidden md:block absolute top-1/3 left-20 text-5xl opacity-60 animate-pulse">🤶</div>
				<div className="hidden md:block absolute top-2/3 right-10 text-5xl opacity-60">🎁</div>
				<div className="hidden lg:block absolute top-1/2 left-5 text-4xl opacity-40">⭐</div>
				<div className="hidden lg:block absolute bottom-1/3 right-5 text-4xl opacity-40 animate-bounce" style={{ animationDuration: '4s' }}>🔔</div>
			</div>

			<main className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center gap-8">
			{/* Initial Claim Button */}
			{step === "initial" && (
				<Card className="w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-500">
						<CardContent className="p-8 text-center space-y-6">
							<div className="text-5xl sm:text-7xl">🎁</div>
							<h1 className="text-xl lg:text-3xl font-bold text-red-700">
								You&apos;ve Got a Gift! 🎅
							</h1>
							<p className="sm:text-base lg:text-lg text-gray-600">
								Something special is waiting for you...
							</p>
							<Button
								onClick={handleClaimClick}
								className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm sm:text-base py-6"
							>
								Open Your Gift 🎄
							</Button>
						</CardContent>
					</Card>
				)}

			{/* Video Player */}
			{step === "video" && (
				<div className="w-full animate-in fade-in zoom-in duration-300">
					<VideoPlayer 
						src="/christmas.mp4" 
						onEnded={handleVideoEnd}
					/>
				</div>
			)}			{/* Phone Number Form */}
				{step === "form" && (
					<Card className="w-full max-w-md shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
						<CardContent className="p-6">
							<div className="space-y-10">
								<div className="text-center space-y-6">
									<h1 className="text-xl lg:text-2xl font-bold text-red-700">
										🎅 Congratulations! 🎅
									</h1>
									<p className="sm:text-base text-gray-600">
										Enter your phone number to receive your ₹1000 Amazon voucher!
									</p>
								</div>

								<form onSubmit={handleSubmit} className="space-y-4">
									<div>
										<Input
											type="tel"
											placeholder="10-digit phone number"
											value={phoneNumber}
											onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
											maxLength={10}
											className="sm:text-base"
											required
										/>
									</div>

									<Button
										type="submit"
										className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold sm:text-base py-6"
										disabled={loading}
									>
										{loading ? "Sending..." : "Claim My Voucher 🎅🎁"}
									</Button>
								</form>
							</div>
						</CardContent>
					</Card>
				)}

			{/* Success Message */}
			{step === "success" && (
				<Card className="w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-500 bg-linear-to-b from-white to-red-50">
						<CardContent className="p-8 text-center space-y-4 ">
							<div className="text-6xl">🎅🎉</div>
							<h1 className="text-xl lg:text-3xl font-bold text-red-700">
								Success!
							</h1>
							<p className="sm:text-base lg:text-lg text-gray-600">
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
