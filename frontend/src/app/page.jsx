"use client";
import { useState } from "react";
import dotenv from "dotenv";
dotenv.config();

const Home = () => {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const handleSend = async () => {
		if (!input) return;

		const userMessage = { sender: "You", content: input };
		setMessages((prevMessages) => [...prevMessages, userMessage]);
		setInput("");

		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
			},
			body: JSON.stringify({
				model: "gpt-3.5-turbo",
				messages: [{ role: "user", content: input }],
				assistant: `${process.env.NEXT_PUBLIC_ASSISTANT_ID}`,
			}),
		});
		const data = await response.json();
		console.log(data);
		if (data.choices && data.choices.length > 0) {
			const botMessage = {
				sender: "Shield Darya",
				content: data.choices[0].message.content.trim(),
			};
			setMessages((prevMessages) => [...prevMessages, botMessage]);
		} else {
			console.error("No choices returned from the API.", data);
			const errorMessage = {
				sender: "Shield Darya",
				content: "Sorry, I couldn't find an answer.",
			};
			setMessages((prevMessages) => [...prevMessages, errorMessage]);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			handleSend();
		}
	};

	const toggleChat = () => {
		setIsOpen((prev) => !prev);
	};

	return (
		<div className="flex justify-center items-center h-screen relative">
			<div className="flex flex-col justify-center">
				<div
					onClick={toggleChat}
					className="cursor-pointer bg-blue-500 text-white p-8 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 z-10"
				>
					<img src="icon.svg" alt="chat" />
				</div>
				{isOpen && (
					<div className="mt-3">
						<div className="flex flex-col h-[500px] w-[400px] border border-gray-300 rounded-lg overflow-hidden bg-white shadow-md mb-2">
							<div className="flex-1 p-4 overflow-y-auto border-b border-gray-300">
								{messages.map((msg, index) => (
									<div
										key={index}
										className={`mb-2 p-2 rounded-lg ${
											msg.sender === "You"
												? "bg-blue-500 text-white self-end"
												: "bg-gray-200 text-black self-start"
										}`}
									>
										<strong>{msg.sender}: </strong>
										{msg.content}
									</div>
								))}
							</div>
							<div className="flex p-2 border-t border-gray-300">
								<input
									type="text"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={handleKeyDown}
									placeholder="Та асуух зүйлээ бичнэ үү..."
									className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-black"
								/>
								<button
									onClick={handleSend}
									className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
								>
									Send
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;