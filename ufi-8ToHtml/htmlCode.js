// Import Required modules
const fs = require ('fs');
const {encode} = require('html-entities');

//Function to check if a character is a special letter (non-ASCII)
function isSpecialLetter(char) {
	return /[^\x00-\x7F]/.test(char); //Matches any character outside ASCII range
}

//Function to convert special letters to HTML numeric entities
function convertSpecialLetters(text){
	return text.split('').map(char=>{
		//convert only special letters, leave symbols as they are
		if(isSpecialLetter(char)){
			//codePoint for correct handling
			//instead of {charCodeAt(0)};
			return `&#${char.codePointAt(0)};`;
		}
		return char; //Return unchanged character if not special character
	}).join('');
}

// Function to read an HTML file -> convert special characters to their
// HTML number equivalent
function convertHTMLFile(inputFilePath, outputFilePath) {
	//Read the HTML file
	fs.readFile(inputFilePath, 'utf-8', (err, data) =>{
		if(err){
			console.error('Error reading the file:', err);
			return;
		}

		//convert special characters in the HTML content to HTML numeric entities
		//"old code=>"const convertedContent = encode(data);
		//Convert ONLY special letters in the HTML content
		const convertedContent = convertSpecialLetters(data);
		//Write the converted content to an output file
		fs.writeFile(outputFilePath, convertedContent, (err) => {
			if(err){
				console.error('Error writing the file:', err);
			} else {
				console.log('File converted succesfully!');
			}
		});
	});
}

//Get 'additional' commandline arguments
const args = process.argv.slice(2); // skip the first 2 arguments (node script and path)
//
// Specify the input and output file paths
// Default file names
let inputFile = 'input.html'; //Path to your input HTML file
let  outputFile = 'output.html'; //Path to save the converted HTML
// Check if the user provided an output file name as  command-line argument
if(args.length > 0){
	inputFile = args[0]; // the first arg will be the input file name to get
	let tempTitle = inputFile.slice(0, -5);
	outputFile = tempTitle + '-KOBO.html'; // add tag to output file
} else {
	console.log("No input file name provided. Fetching default 'input.html'.");
}

//Call the function to convert the file
convertHTMLFile(inputFile, outputFile);

