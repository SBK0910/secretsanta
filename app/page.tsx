"use client";

import { useState, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import VideoPlayer from "@/components/VideoPlayer";
import { useSearchParams } from "next/navigation";

type Step = "initial" | "video" | "form" | "success" | "error";

function SecretSantaContent() {
	const [step, setStep] = useState<Step>("initial");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [loading, setLoading] = useState(false);
	const [voucherUrl, setVoucherUrl] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const handleClaimClick = () => {
		setStep("video");
	};

	const handleVideoEnd = () => {
		setStep("form");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate last 4 digits (must be 4 digits)
		if (phoneNumber.length !== 4 || !/^\d{4}$/.test(phoneNumber)) {
			alert("Please enter the last 4 digits of your phone number");
			return;
		}

		setLoading(true);

		try {
			const response = await fetch("/api/send-voucher", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ phoneNumber, token }),
			});

			const data = await response.json();

			if (response.ok) {
				setVoucherUrl(data.voucherUrl);
				setStep("success");
			} else {
				setErrorMessage(data.error || "Something went wrong");
				setStep("error");
			}
		} catch {
			setErrorMessage("Error submitting. Please try again.");
			setStep("error");
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
			)}

			{/* Phone Number Form */}
			{step === "form" && (
				<Card className="w-full max-w-md shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
						<CardContent className="p-6">
							<div className="space-y-10">
								<div className="text-center space-y-6">
									<h1 className="text-xl lg:text-2xl font-bold text-red-700">
										🎅 Congratulations! 🎅
									</h1>
									<p className="sm:text-base text-gray-600">
										Enter the last 4 digits of your phone number to verify and receive your voucher!
									</p>
								</div>

								<form onSubmit={handleSubmit} className="space-y-4">
									<div>
										<Input
											type="tel"
											placeholder="Last 4 digits"
											value={phoneNumber}
											onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 4))}
											maxLength={4}
											className="sm:text-base text-center text-2xl tracking-widest"
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
					<CardContent className="p-8 text-center space-y-6">
						<div className="text-6xl">🎅🎉</div>
						<h1 className="text-xl lg:text-3xl font-bold text-red-700">
							Success!
						</h1>
						<p className="sm:text-base lg:text-lg text-gray-600">
							Your Amazon voucher is ready!
						</p>
						<Button
							onClick={() => window.open(voucherUrl, "_blank")}
							className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold sm:text-base py-6"
						>
							Claim Your Voucher 🎁
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Error Message */}
			{step === "error" && (
				<Card className="w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-500 border-2 border-red-500">
					<CardContent className="p-8 text-center space-y-4">
						<div className="text-6xl">🎅</div>
						<h1 className="text-xl lg:text-3xl font-bold text-red-700">
							Access Denied
						</h1>
					<p className="sm:text-base text-gray-600">
						{errorMessage || "You need a valid invitation link to access this gift."}
					</p>
				</CardContent>
			</Card>
		)}
	</main>
</div>
);
}

export default function Home() {
	return (
		<Suspense fallback={
			<div className="fixed inset-0 flex items-center justify-center bg-linear-to-br from-red-600 via-white to-red-700">
				<div className="flex flex-col items-center gap-4">
					<div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
					<p className="sm:text-base text-gray-600">Loading...</p>
				</div>
			</div>
		}>
			<SecretSantaContent />
		</Suspense>
	);
}