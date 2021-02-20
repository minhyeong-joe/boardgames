import BoardGameImage from "../assets/image/boardgame_temp.png";

const GAMES = [
	{
		id: "1",
		name: "For Sales",
		image_url:
			"https://cf.geekdo-images.com/dJh9HkZC346NgPTAicJq_A__opengraph_letterbox/img/VkubAUejIItrZdQ0lgqkpE_pv4k=/fit-in/1200x630/filters:fill(auto):strip_icc()/pic1513085.jpg",
		min: 3,
		max: 6,
		complexity: "easy",
		duration: "short",
	},
	{
		id: "2",
		image_url: BoardGameImage,
		name: "Board Game 2",
		min: 2,
		max: 8,
		complexity: "hard",
		duration: "long",
	},
	{
		id: "3",
		image_url: BoardGameImage,
		name: "Board Game 3",
		min: 2,
		max: 4,
		complexity: "easy",
		duration: "short",
	},
	{
		id: "4",
		image_url: BoardGameImage,
		name: "Board Game 4",
		min: 3,
		max: 10,
		complexity: "medium",
		duration: "long",
	},
	{
		id: "5",
		image_url: BoardGameImage,
		name: "Board Game 5",
		min: 4,
		max: 8,
		complexity: "easy",
		duration: "medium",
	},
];

export default GAMES;
