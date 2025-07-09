import React from "react";
import { Home, MessageSquare, Shield, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
	const navigate = useNavigate();

	const footerSections = [
		{
			title: "For Tenants",
			links: [
				{ name: "Search Properties", path: "/find-room" },
				{ name: "How It Works", path: "/about" },
				{ name: "Safety Guidelines", path: "/safety" },
				{ name: "Help Center", path: "/help" },
				{ name: "Student Housing", path: "/find-room" },
				{ name: "Professional Housing", path: "/find-room" },
			],
		},
		{
			title: "For Landlords",
			links: [
				{ name: "List Your Property", path: "/list-property" },
				{ name: "Landlord Resources", path: "/help" },
				{ name: "Verification Process", path: "/safety" },
				{ name: "Success Stories", path: "/about" },
				{ name: "Dashboard", path: "/dashboard" },
				{ name: "Property Management", path: "/dashboard" },
			],
		},
		{
			title: "Company",
			links: [
				{ name: "About RentFair", path: "/about" },
				{ name: "Our Mission", path: "/about" },
				{ name: "Safety", path: "/safety" },
				{ name: "Contact Us", path: "/contact" },
				{ name: "Help Center", path: "/help" },
				{ name: "Support", path: "/help" },
			],
		},
		{
			title: "Support",
			links: [
				{ name: "Help Center", path: "/help" },
				{ name: "Customer Support", path: "/contact" },
				{ name: "Report an Issue", path: "/contact" },
				{ name: "Safety Guidelines", path: "/safety" },
				{ name: "Privacy Policy", path: "/privacy-policy" },
				{ name: "Community Guidelines", path: "/safety" },
			],
		},
	];

	return (
		<footer className="bg-gray-900 text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
					{/* Logo and Description */}
					<div className="lg:col-span-2">
						<div
							className="flex items-center space-x-2 mb-4 cursor-pointer"
							onClick={() => navigate("/")}
						>
							<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
								<Home className="w-5 h-5 text-white" />
							</div>
							<span className="text-xl font-bold">RentFair</span>
						</div>
						<p className="text-gray-400 mb-6 leading-relaxed">
							Making rental housing transparent, fair, and scam-free for
							students and professionals across India.
						</p>

						{/* Trust Badges */}
						<div className="space-y-3">
							<div className="flex items-center space-x-2">
								<Shield className="w-4 h-4 text-green-400" />
								<span className="text-sm text-gray-300">Verified Listings</span>
							</div>
							<div className="flex items-center space-x-2">
								<Star className="w-4 h-4 text-yellow-400" />
								<span className="text-sm text-gray-300">Trusted Reviews</span>
							</div>
							<div className="flex items-center space-x-2">
								<MessageSquare className="w-4 h-4 text-blue-400" />
								<span className="text-sm text-gray-300">24/7 Support</span>
							</div>
						</div>
					</div>

					{/* Footer Links */}
					{footerSections.map((section, index) => (
						<div key={index}>
							<h3 className="font-semibold text-white mb-4">{section.title}</h3>
							<ul className="space-y-2">
								{section.links.map((link, linkIndex) => (
									<li key={linkIndex}>
										<button
											onClick={() => navigate(link.path)}
											className="text-gray-400 hover:text-white transition-colors text-sm text-left"
										>
											{link.name}
										</button>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-gray-800 mt-12 pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<p className="text-gray-400 text-sm mb-4 md:mb-0">
							© 2024 RentFair. All rights reserved.
						</p>

						<div className="flex items-center space-x-6">
							<button
								onClick={() => navigate("/privacy-policy")}
								className="text-gray-400 hover:text-white transition-colors text-sm"
							>
								Privacy Policy
							</button>
							<button
								onClick={() => navigate("/terms-and-conditions")}
								className="text-gray-400 hover:text-white transition-colors text-sm"
							>
								Terms of Service
							</button>
							<button
								onClick={() => navigate("/cookie-policy")}
								className="text-gray-400 hover:text-white transition-colors text-sm"
							>
								Cookie Policy
							</button>
						</div>
					</div>

					<div className="mt-6 text-center">
						<p className="text-gray-500 text-xs">
							Made by
							<a
								href="https://devnaam4s.vercel.app/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-500 underline mx-1"
							>
								Devnaam
							</a>
							for a fairer rental market
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
