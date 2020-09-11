class cChar {
    constructor(mainChar, mainCharCode) {
		this.mainChar = mainChar;
		this.mainCharCode = mainCharCode;
		this.vowelChar = "";
		this.vowelNumber = 0;
		this.index = 0;
		this.maatraa = 0;
		this.maatraaCumulative = 0;
		this.isRadeef = false;
		this.isKaafiyaa = false;

		// space / comma OR whole vowel 
        if (((mainCharCode == 32)||(mainCharCode == 44)) || ((mainCharCode >= 2309) && (mainCharCode <= 2324)))
          this.vowel = mainChar;
        
        // consonant OR consonant with dot at bottom
        if (((mainCharCode >= 2325) && (mainCharCode <= 2361)) || ((mainCharCode >= 2392) && (mainCharCode <= 2399)))
          this.vowel = "अ";

        // anusvaar (the bindi on top) which sometimes is short-cut for half letter
        if (mainCharCode == 2306) 
          this.vowel = "्";
    }
    set vowel(vowelChar) {
		this.vowelChar = vowelChar;
		// set Vowel Number
		switch(vowelChar)
		{
			case "्":
				this.vowelNumber = -1;
				break;
			case "अ": 
				this.vowelNumber = 1;
				break;
			case "आ": case "ा": 
				this.vowelNumber = 2;
				break;
			case "इ": case "ि":
				this.vowelNumber = 3;
				break;
			case "ई": case "ी":
				this.vowelNumber = 4;
				break;
			case "उ": case "ु":
				this.vowelNumber = 5;
				break;
			case "ऊ": case "ू":
				this.vowelNumber = 6;
				break;
			case "ए": case "े":
				this.vowelNumber = 7;
				break;
			case "ऐ": case "ै":
				this.vowelNumber = 8;
				break;
			case "ओ": case "ो":
				this.vowelNumber = 9;
				break;
			case "औ": case "ौ":
				this.vowelNumber = 10;
				break;
			case "ऑ": case "ॉ":
				this.vowelNumber = 11;
				break;
			case "ऋ": case "ृ":
				this.vowelNumber = 12;
				break;
			default:
				this.vowelNumber = -10;
		}
		// set char maatraa as per vowel
		switch (this.vowelNumber)
        {
			case 1: case 3: case 5: case 12:
				this.maatraa = 1;
				break;
            case 2: case 4: case 6: case 8: case 10: case 7: case 9: case 10: case 11:
				this.maatraa = 2;
				break;
			default:
				this.maatraa = 0;
				break;
		}
    }
    // determine if character is half letter
    isHalfLetter()
    {
    	return (this.vowelNumber == -1); 
    }
    isPureVowel()
    {
    	return (this.mainChar == this.vowelChar);
    }
    // check if this character is of laghu vowel
    isLaghu ()
    {
    	switch(this.vowelNumber)
    	{
    		case 1: case 3: case 5: case 12:
    			return true;
    			break;
    		default:
    			return false;
    			break;
    	}
    }
    isDeergha()
    {
    	switch(this.vowelNumber)
    	{
    		case 2: case 4: case 6: case 8: case 10: case 7: case 9: case 10:
    			return true;
    			break;
    		default:
    			return false;
    			break;
    	}
    }
    // determine when a half letter will have 0 or 1 maatraa
	// the logic for default handling - which the user can always override
	// p = previous letter 
	// this = current letter for which the len is to be determined
	// n = next letter (consonant+vowel array structure)	
	calculateHalfLetterLen(p=false,n=false)
	{
		if (!p)  // no previous letter, half maatraa is first letter of line
		{
      		this.maatraa = 0;
      		return this.maatraa;
		}
      	if (p.vowelNumber === -10) // no previous letter, half maatraa is first letter of word
      	{
      		this.maatraa = 0;
      		return this.maatraa;
      	}

      	// special combinations ----------------
	    if ((this.mainChar == "म") && (n.mainChar == "ह"))
	    {
	      this.maatraa = 0;
	      return this.maatraa;
	    }
	    if ((this.mainChar == "न") && (n.mainChar == "ह"))
	    {
	      this.maatraa = 0;
	      return this.maatraa;
	    }
	  	// end special combinations ------------

	  	if (p.isLaghu())
	  	{
	  		this.maatraa = 1;
	  		return this.maatraa;
	  	}
	  	if (n)
	  	{
	  		if (p.isDeergha() && n.isDeergha()) // both side deergha
		    {
		    	this.maatraa = 1;
		      	return this.maatraa;
		    }
	  	}
	  	return 0;		  	
	}
	adjustCharMaatraa()
	{
		// whole chars
		//    aa, ee, oo                        all other deergha
		if ((this.vowelNumber%2 == 0) || ((this.vowelNumber>6) && (this.vowelNumber<12)))
		{
		  if (this.maatraa == 1)
		    this.maatraa = 2;
		  else
		    this.maatraa = 1;
		}
		if (this.vowelNumber == -1) // half maatraa
		{
			if (this.maatraa == 0)
				this.maatraa = 1;
			else
				this.maatraa = 0;
		}
	}
	// return full text mainchar + vowelchar
	get text()
	{
		let txt = "";
		if ((this.vowelNumber != -10) && (this.vowelNumber != 0))  // hindi character
		{
		  if (this.isPureVowel()||(this.vowelNumber == 1))
		  {
		    txt = this.mainChar;
		  }
		  else
		  {
		    txt = this.mainChar+this.vowelChar;
		  }
		}
		return txt;
	}
	// this is different from get text in that it returns all chars, even non-hindi ones
	get joinedConsonantVowel() 
	{
		if (this.mainChar==this.vowelChar)
		  return this.vowelChar; // c is also a vowel - like आ आ
		if (this.vowelChar == 'अ')
		  return this.mainChar; // could be a case of न अ 
		return this.mainChar+this.vowelChar;
	}
}


class cLine {
	constructor() {
		this.characters = new Array();
		this.count = 0;
		this.maatraa = 0;
		this.isComposite = false;
	}
	// change the vowel of the last character
	lastCharVowel(vowelString)
	{
		const lastChar = this.characters[this.count-1];
		const oldMaatraa = lastChar.maatraa;
		lastChar.vowel = vowelString;
		this.maatraa += lastChar.maatraa - oldMaatraa;
		lastChar.maatraaCumulative += lastChar.maatraa - oldMaatraa;
	}
	// add a new character to line
	push(newChar)
	{
		newChar.index = this.count;
		// assign cumulative maatraa of char as per previous char
		if (newChar.index == 0)
			newChar.maatraaCumulative = newChar.maatraa;
		else
			newChar.maatraaCumulative = this.characters[this.count-1].maatraaCumulative + newChar.maatraa;

		this.characters.push(newChar);
		this.maatraa += newChar.maatraa;
		this.count++;
	}
	// get the nth character of a line
	charByIndex(idx)
	{
		return this.characters[idx];
	}
	// get previous character w.r.t. given current character
	previousChar(c) // c = current character
	{
		if ((c.index != 0) && (this.count>1))
			return this.characters[c.index-1];
		else
			return false;
	}
	// get next character w.r.t. given current character
	nextChar(c) // c = current character
	{
		if ((this.count>1) && (c.index < this.count - 1))
			return this.characters[c.index+1];
		else
			return false;
	}
	// return an array of half letters in a line
	getHalfLetters()
	{
		const halfLetters = this.characters.filter(function (thisChar) {
			return thisChar.isHalfLetter();
		});
		return halfLetters;
	}
	// calculate default maatraa for half letters in a line based
	calculateHalfLettersMaatraa()
	{
		const halfLetters = this.getHalfLetters();
		let maatraa = 0;
		let i;
		for (i=0;i<halfLetters.length;i++)
		{
			const thisHalfLetter = halfLetters[i];
			maatraa = 0;
			// debugger;
			if (thisHalfLetter.index == 0) // first character, no previous, next not required
				maatraa = thisHalfLetter.calculateHalfLetterLen();
			else
			{
				const previousChar = this.previousChar(thisHalfLetter);
				const nextChar = this.nextChar(thisHalfLetter.index+1);
				maatraa = thisHalfLetter.calculateHalfLetterLen(previousChar, nextChar);
			}
			// update cumulative maatraa of line
			if (maatraa>0)
			{
				this.maatraa += maatraa;
				thisHalfLetter.maatraaCumulative += maatraa;
				let j;
				// update maatraaCumulative for all subsequent chars in line
				for (j = thisHalfLetter.index+1; j < this.count; j++)
					this.characters[j].maatraaCumulative++;
			}
		};
	}
	adjustCharMaatraa(charIdx)
	{
		let thisChar = this.charByIndex(charIdx);
		let oldMaatraa = thisChar.maatraa;
		thisChar.adjustCharMaatraa();
		let diff = thisChar.maatraa - oldMaatraa;
		this.maatraa += diff;
		let i;
		for (i = charIdx; i < this.count; i++)
			this.charByIndex(i).maatraaCumulative += diff;

		return this.maatraa;
	}
}

class compositeLine
{
	constructor(originalLineIdx) {
		this.originalLineIdx = originalLineIdx;
		this.maatraa = 0;
		this.remainder = 0;
	}
}

class cPoem {
	constructor(originalText) {
		this.originalText = originalText;
		this.lines = new Array();
		this.lineCount = 0;
		this.maxLineLen = 0;
		this.compositeLines = [];
		this.baseCount = 1;
		this.radeefTruncated = 0;
		this.radeefArray = [];
	}
	pushLine(newLine)
	{
		this.lines.push(newLine)
		this.lineCount++;
		if (this.maxLineLen < newLine.maatraa)
			this.maxLineLen = newLine.maatraa;
	}
	get text() 	{
		return this.originalText;
	}
	adjustCharMaatraa(lineIdx, charIdx)
	{
		let newMaatraaOfLine = this.lines[lineIdx].adjustCharMaatraa(charIdx);
		if (this.maxLineLen < newMaatraaOfLine)
			this.maxLineLen = newMaatraaOfLine;
	}
	setComposite(lineIdx)
	{
		this.lines[lineIdx].isComposite = !this.lines[lineIdx].isComposite;
		this.calculateCompositeMaatraa();
	}
	setBaseCount(baseCount)
	{
		this.baseCount = baseCount;
		this.calculateCompositeMaatraa();
	}
	calculateCompositeMaatraa()
	{
		let compositeInProgress = false;
		// reset composite lines array
		this.compositeLines.length = 0;
		if (this.lineCount > 1)
		{
			let i = 0;
			for (i = 1; i < this.lines.length; i++)
			{
			if (this.lines[i].isComposite)  // is part of composite line
				{
					// debugger;
					let len = this.compositeLines.length;
					if (!compositeInProgress) // new composite line
					{
						compositeInProgress = true;
						this.compositeLines[len] = new compositeLine(i-1); // starting position in poem lines, line index is the *previous*
						this.compositeLines[len].maatraa = this.lines[i-1].maatraa;  // total maatraa count of prev (starting) line
						this.compositeLines[len].maatraa += this.lines[i].maatraa; // add total maatraa count of current line
					}
					else // in progress composite line
					{
						// just add to in progress composite line
						this.compositeLines[len-1].maatraa += this.lines[i].maatraa;
					}
					len = this.compositeLines.length;
					// set whether the composite maatraa is multiple of base count
					if ((this.compositeLines[len-1].maatraa % this.baseCount) == 0)
					  this.compositeLines[len-1].multipleOfBaseCount = true;
					else
					  this.compositeLines[len-1].multipleOfBaseCount = false;
				}
				else  // not part of composite line
				{
				  if (compositeInProgress)
				  {
				    // stop in progress
				    compositeInProgress = false;
				  }
				}
			}
		}
		let i;
		for (i = 0; i< this.compositeLines.length; i++)
			this.calculateRemainder(i);
	}
	calculateRemainder(compositeIdx)
	{
		if (this.baseCount > 1)
		{
			let compositeMaatraa = this.compositeLines[compositeIdx].maatraa;
			let remainder = compositeMaatraa % this.baseCount;
			if (remainder != 0)
			{
				let result = compositeMaatraa/this.baseCount;
				let whole = parseInt(result);
				let remainderInDecimal = result - whole;
				if (remainderInDecimal <= 0.5)
					this.compositeLines[compositeIdx].remainder = remainder;
				else
					this.compositeLines[compositeIdx].remainder = (((whole+1)*this.baseCount)-compositeMaatraa)*-1;
			}
		}
		else
			this.compositeLines[compositeIdx].remainder = 0;
	}
	calculateRadeef()
	{
	    let radeef = '';
	    this.radeefArray = [];

	    let radeef1, radeef2;
	    let linelen1 = this.lines[0].count;
	    let linelen2 = this.lines[1].count;

	    let foundRadeefEnd = false;
	    let i = linelen1 - 1; // first line index
	    let j = linelen2 - 1; // second line index

	    while ((!foundRadeefEnd) && (i >= 0) && (j >= 0))
	    {
	      radeef1 = this.lines[0].characters[i].joinedConsonantVowel;
	      radeef2 = this.lines[1].characters[j].joinedConsonantVowel;

	      if (radeef1 == radeef2)
	      {
	        radeef = radeef1 + radeef;
	        this.radeefArray[this.radeefArray.length] = [];
	        this.radeefArray[this.radeefArray.length - 1][0] = this.lines[0].characters[i].mainChar;
	        this.radeefArray[this.radeefArray.length - 1][1] = this.lines[0].characters[i].vowelChar;
	        i--;
	        j--;
	      }
	      else
	      {
	        foundRadeefEnd = true;
	      }
	    }

	    // cut out the last part of calculated radeef if it has a space and an incomplete word.
	    // eg. for 
	    // कोई उम्मीद बर नहीं आती
	    // कोई सूरत नज़र नहीं आती
	    // sys will calculate radeef as as "र नहीं आती" because that is common between top and bottom line
	    // but radeef is "नहीं आती"
	    let realRadeef = radeef.substr(radeef.indexOf(' ')+1);
	    // console.log(radeef);

	    // truncate radeefArray too
	    // if clause implies a truncation did occur in the above substr code, and hence array has to be truncated 
	    if (radeef !== realRadeef) 
	    {
	      this.radeefTruncated = 1;
	      for (i = this.radeefArray.length - 1; i >= 0 ; i--) 
	      {
	        if (this.radeefArray[i][0] == " ") break;
	      }
	      this.radeefArray.length = i;
	      radeef = realRadeef;
	    }
	    // the characters in this radeefArray is in reverse order
	    let radeefLen = this.radeefArray.length;
	    // now mark radeef chars in all relevant lines
	    for (i = 0; i < this.lines.length; i++) {
	      let supposedlyRelevantLine = false;
	      // first 2 lines
	      if (i<=1) supposedlyRelevantLine = true;
	      // intermediate line followed by blank line
	      if ((i>1) && (i<(this.lines.length-1)) && (this.lines[i+1].characters.length==0)) supposedlyRelevantLine = true;
	      // last line
	      if (i==(this.lines.length-1)) supposedlyRelevantLine = true;
	      let linelen = this.lines[i].characters.length;
	      if ((supposedlyRelevantLine) && (linelen > radeefLen))
	      {
	        for (let j = 0; j < radeefLen; j++) {
	          if ((this.radeefArray[j][0] == this.lines[i].characters[linelen-1-j].mainChar) && (this.radeefArray[j][1] == this.lines[i].characters[linelen-1-j].vowelChar))
	            this.lines[i].characters[linelen-1-j].isRadeef = true;
	          else
	            break;
	        }
	      }
	    }
	}
	calculateKaafiyaa()
	{
		debugger;
		let radeefLen = this.radeefArray.length;
		let foundKaafiyaaEnd = false;
		let kaafiyaa,kaafiyaa1, kaafiyaa2;
		let kaafiyaaArray = [];
		let linelen1 = this.lines[0].characters.length;
		let linelen2 = this.lines[1].characters.length;
		let i = linelen1 - 1 - radeefLen; // first line index
		let j = linelen2 - 1 - radeefLen; // second line index

		while ((!foundKaafiyaaEnd) && (i >= 0) && (j >= 0))
		{
		  kaafiyaa1 = this.lines[0].characters[i].vowelNumber;
		  kaafiyaa2 = this.lines[1].characters[j].vowelNumber;
		  if (kaafiyaa1 == kaafiyaa2)
		  {
		    kaafiyaa = kaafiyaa1 + kaafiyaa;
		    kaafiyaaArray[kaafiyaaArray.length] = kaafiyaa1;
		    i--;
		    j--;
		  }
		  else
		  {
		    foundKaafiyaaEnd = true;
		  }
		}
		if (kaafiyaaArray[0]==-10) // space character kaa vowelNumber
		  kaafiyaaArray.splice(0,1);
		// console.log(kaafiyaaArray);

		let kaafiyaaLen = kaafiyaaArray.length;

		// now mark kaafiyaa chars in all relevant lines
		for (i = 0; i < this.lines.length; i++) {
		  let supposedlyRelevantLine = false;
		  // first 2 lines
		  if (i<=1) supposedlyRelevantLine = true;
		  // intermediate line followed by blank line
		  if ((i>1) && (i<(this.lines.length-1)) && (this.lines[i+1].characters.length==0)) supposedlyRelevantLine = true;
	      // last line
	      if (i==(this.lines.length-1)) supposedlyRelevantLine = true;
		  let linelen = this.lines[i].characters.length;
		  if ((supposedlyRelevantLine) && (linelen > (radeefLen+kaafiyaaLen+this.radeefTruncated)))
		  {
		    for (j = 0; j < kaafiyaaLen; j++) {
		      if (kaafiyaaArray[j] == this.lines[i].characters[linelen-1-radeefLen-this.radeefTruncated-j].vowelNumber)
		        this.lines[i].characters[linelen-1-radeefLen-this.radeefTruncated-j].isKaafiyaa = true;
		      else
		        break;
		    }
		  }
		}
	}
}

var oPoem;
var oPrevPoem;

function visualize()
{
	splitNprocessPoem();
	if (fGhazal)
    {
      oPoem.calculateRadeef();
      oPoem.calculateKaafiyaa();
    }
    if (fFreeVerse)
    {
    	let baseC = parseInt(document.getElementById("baseCount").value);
    	oPoem.setBaseCount(baseC);
    }
	draw();
	// show controls
	document.getElementById("divControls").style.display = "block";
}

function splitNprocessPoem()
{
    oPrevPoem = oPoem;
	oPoem = new cPoem(document.getElementById("pom").value);
    const lines = oPoem.text.split("\n");
    let oldLines = []
    if (typeof oPrevPoem !== 'undefined') oldLines = oPrevPoem.originalText.split("\n");
    const maxLineLen = lines.length;
    let iLine;
    for (iLine = 0; iLine < maxLineLen; iLine++) // process each line - i = line index
    {
    	if ((iLine < oldLines.length) && (lines[iLine] == oldLines[iLine]))
    	{
    		oPoem.pushLine(oPrevPoem.lines[iLine]);
    	}
    	else
    	{
	    	const oLine = new cLine();
	    	// debugger;
	    	lines[iLine] = lines[iLine].replace(/[^\u0900-\u097F ]/g, " "); // replace non-devnagari chars with space
	    	lines[iLine] = lines[iLine].replace("।"," ");
	    	lines[iLine] = lines[iLine].replace(/\s+/g, " "); // remove extra spaces in-between words
	    	lines[iLine] = lines[iLine].trim(); // remove whitespace from both ends
	        for (k=0;k<lines[iLine].length;k++) // process each char: k = char index
	        {
	        	charCode = lines[iLine].charCodeAt(k);
	        	if ((charCode >= 2366) && (charCode <= 2381)) // maatraa
				{
					// new element not added to line array
					// the vowel part of previous element 
					// modified to update maatraa
					oLine.lastCharVowel(lines[iLine].substring(k,k+1));
				}
				else // not maatraa - true new char
				{
					var thisChar = lines[iLine].substring(k,k+1);
					const oChar = new cChar(thisChar,charCode);
		          	oLine.push(oChar);
				}
	        }
	        // console.log(oLine.getHalfLetters());
	        oLine.calculateHalfLettersMaatraa();
	        oPoem.pushLine(oLine);
	     }
    }
    // console.log(oPoem);
}

var charW = 20; 
var charH = 20; 
var paddingLeft = 10;
var lineSpacing = 5;
var fShowText = true;
var fLineSpacing = true;
var fFreeVerse = false;
var fGhazal = false;

// the D3 draw dance!
function draw()
{
	const maxLen = oPoem.maxLineLen;
	const lineCount = oPoem.lineCount;
	var chart = d3.select("#chart");
	chart.select("svg").remove();
	var svg = chart.append("svg")
	          .attr("width", function() {return (fFreeVerse?charW*maxLen+120:charW*maxLen+100);})
	          .attr("height", function() {return (fLineSpacing?(lineCount*(charH+lineSpacing))+(charH*2):(lineCount*charH)+(charH*2));})
	          .attr("style","border-bottom: solid 1px #ddd;");

	// create the "g"s (svg groups) for each line
	if (fLineSpacing)
	{
		var g = svg.selectAll("g")
		.data(oPoem.lines)
		.enter().append("svg:g")
		  .attr("transform", function(d,i) 
		    { 
		      return "translate(" + paddingLeft + "," + ((i*(charH+lineSpacing))+(charH+lineSpacing)) + ")"; 
		    })
		  .attr("id", function(d,i) { return "gLine"+i});
	}
	else
	{
		var g = svg.selectAll("g")
		.data(oPoem.lines)
		.enter().append("svg:g")
		  .attr("transform", function(d,i) 
		    { return "translate(" + paddingLeft + "," + ((i*(charH))+(charH)) + ")" })
		  .attr("id", function(d,i) { return "gLine"+i});
	}

	if (fShowText)
    {
        g.selectAll("text")               // char text
          .data(function(d) {return d.characters;} )  // d = line, subsequent d = characters
          .enter().append("svg:text")
            .attr("y", charH-2)
            .attr("x", function(d) {return drawCharTxtPos(d);})
            .attr("class", "graphText3")
            //.attr("dominant-baseline", "central")
            .attr("text-anchor", "middle")
            .text(function(d) {return d.text;});
    }

    g.selectAll("path")
      .data(function(d) {return d.characters;} ) // d = line, subsequent d = characters
      .enter().append("path")
        .attr("id", function(d,i) {return "char"+i})
        .attr("style", function(d,i) {
          if (fGhazal)
            return drawStyleCharBlock(d,'ghazal');
          else
            return drawStyleCharBlock(d,'consonant');
        })
        .attr("d", function(d,i) {return drawVowPath(d,i);})
        .attr("title", function(d,i) {return d.mainChar+d.vowelChar;})
        .on("click",adjustCharLen);

    // line total maatraa
    if (fFreeVerse) // line maatraa count numbers are clickable
    {
      g.append("svg:text")            // line total maatraa
      .attr("y", charH)
      .attr("x", function(d) {return charW*maxLen+charW;})
      .attr("class", "graphText3")
      .text(function(d) { return (d.maatraa > 0) ? d.maatraa : "";})
      .on("click",markCompositeLine);

      // small dash beside maatraa count
      g.append("svg:line")
        .attr("x1", function(d,i) {return charW*maxLen+(charW*2);})
        .attr("y1", function(d,i) {return charH+2;})
        .attr("x2", function(d) {return charW*maxLen+(charW*2.3);})
        .attr("y2", charH+2)
        .attr("style", function(d,i) {return drawFreeVerseDashStyle(i);})
        .on("click",markCompositeLine);

      // composite line marker
      g.append("svg:line")
        //.attr("x1", function(d) {return charW*maxLen+(charW);})
        .attr("x1", function(d,i) {return drawCompositeLineMarker("x1",i);})
        .attr("y1", function(d,i) {return drawCompositeLineMarker("y1",i);})
        .attr("x2", function(d) {return charW*maxLen+(charW*2.3);})
        .attr("y2", charH+2)
        .attr("style", function(d,i) {return drawCompositeLineMarker("style",i);})
        .on("click",unmarkCompositeLine);
    }    
    else  // normal - numbers are not clickable
    {
      g.append("svg:text")            // line total maatraa, d = line
      .attr("y", charH)
      .attr("x", function(d) {return charW*maxLen+(charW/2);})
      .attr("class", "graphText3")
      .text(function(d) { return (d.maatraa > 0) ? d.maatraa : "";});
    }

    if (fFreeVerse)
    {
    	// composite line total maatraa
    	drawCompositeNumbers();
    }
    
}

// helper for draw function to place text in correct position
function drawCharTxtPos(d)
{
	var x = ((d.maatraaCumulative-d.maatraa)*charW);
	var w = charW*d.maatraa;
	return x+(w/2);
}

// style of char blocks - including color
// c - the character to be styled
function drawStyleCharBlock(c,colorBy)
{

	if (c.vowelNumber === -10) // do not display space, comma
	  return "display: none";

	var color = "white";
	var strokeOp = "0.3";
	var strokeW = 1;
	var fillOp = "0.2";

	// call conColor to determine color and opacity as per consonant
	if (colorBy == 'consonant')
	{
	  	color = "rgb(0,220,255)"; // blue 
	}
	if (colorBy == 'ghazal')
    {
      if (c.isRadeef) // is a radeef char
      {
        color = "rgb(0,220,255)"; // blue
        fillOp = "0.5";
      }
      if (c.isKaafiyaa) // is a kaafiyaa char
      {
        color = "rgb(0,255,0)"; // green
        fillOp = "0.5";
      }
    }

	// unknown vowel, individual length unknown/0
	// what are some examples when this occurs? 
	// 1 eg. ऋ as in rishi, half maatraas
	// any other examples? 
	if ((c.vowelNumber == -1) && (c.maatraa == 0))
	{
	  color = "black";
	  fillOp = "0.6";    
	}

	return "fill: "+color+"; fill-opacity: " + fillOp + ";stroke:black; stroke-width: "+strokeW+"; stroke-opacity: "+strokeOp;
}

// shapes' shape determined by vowel
function drawVowPath(d,i)
{
	var p = "";
	var x = ((d.maatraaCumulative-d.maatraa)*charW);  // where the drawing of this path has to start horizontally
	var w = charW*d.maatraa;
	var h = charH;
	if ((d.vowelNumber == -1) && (d.maatraa == 0)) // half letter of 0 width
	{
	  w = 4;  // small black box on top
	  h = 4;  // small black box on top
	  x = x-2;  
	  p = "M"+x+",0 L"+x+",-"+h + " L"+(x+w)+",-"+h+" L"+(x+w)+",0 z";
	}
	else
	{
	  // set all vowels to a to square or double width rectangle
	  p = "M"+x+",0 L"+x+","+h + " L"+(x+w)+","+h+" L"+(x+w)+",0 z";
	}
	return p;
}

// toggle ShowText control
function fnShowText()
{
	fShowText = !fShowText;
	document.getElementById("chkShowText").checked = fShowText;
	draw();
}

// draw composite line markers if free verse is on
function drawFreeVerseDashStyle(i)
  {
      if (oPoem.lines[i].maatraa == 0)  // empty line
        return "display:none;";

      return "stroke:black;stroke-width:4;"
  }

// toggle Free Verse support
  function fnFreeVerseSupport()
  {
    fFreeVerse = !fFreeVerse;
    if (fFreeVerse)
    {
      document.getElementById("chkGhazal").disabled = true;
      document.getElementById("spanFreeVerse").style.display = "inline";
      let baseC = parseInt(document.getElementById("baseCount").value);
      oPoem.setBaseCount(baseC);
    }
    else
    {
      document.getElementById("chkGhazal").disabled = false;
      document.getElementById("spanFreeVerse").style.display = "none";
    }
    draw();
  }

function drawCompositeLineMarker(drawWhat,i)
  {
  	const maxLen = oPoem.maxLineLen;
    if (drawWhat == "x1")
    {
      if (i==0)
        return charW*maxLen+(charW*2);
      if (oPoem.lines[i].isComposite)
        return charW*maxLen+(charW*2.3);        
      else
        return charW*maxLen+(charW*2);
    }
    if (drawWhat == "y1")
    {
      if (oPoem.lines[i].isComposite)
      {
        if (fLineSpacing)
          return -3;
        else
          return 0;
      }               
      else
        return charH;
    }
    if (drawWhat == "style")
    {
      if ((oPoem.lines[i].maatraa == 0) || (!oPoem.lines[i].isComposite))  // empty line || not composite
        return "display:none;";

      return "stroke:black;stroke-width:4;"
    }
  }

function drawCompositeNumbers()
{
	const maxLen = oPoem.maxLineLen;
	let chart = d3.select("#chart");
	let svg = chart.select("svg");
	
	let y = 0;
	if (fLineSpacing)
		y = charH + lineSpacing;
	else
		y = charH;

	let compositeLTotal = svg.selectAll(".compositeCountT")
	  .data(oPoem.compositeLines)
	  .enter().append("svg:text")
	  .attr("y", function(d) {return ((d.originalLineIdx*y)+y+charH);})
	  .attr("x", function(d) {return paddingLeft + 8 + charW*maxLen+(charW*2);})
	  .attr("class", "compositeCountT")
	  .attr("style", function(d) {return d.multipleOfBaseCount?"fill:black":"fill:red";})
	  // .attr("style", function(d) {return "fill:black";})
	  .text(function(d) {return d.maatraa;});

	let compositeLRemainder = svg.selectAll(".compositeCountR")
	  .data(oPoem.compositeLines)
	  .enter().append("svg:text")
	  .attr("y", function(d) {return ((d.originalLineIdx*y)+y+charH)+10;})
	  .attr("x", function(d) {return paddingLeft + 8 + charW*maxLen+(charW*2)+20;})
	  .attr("class", "compositeCountR")
	  .attr("style", function(d) {return d.remainder!=0?"fill:red;font-size:80%":"display:none";})
	  .text(function(d) {return d.remainder>0?"+"+d.remainder:d.remainder;});
}

// toggle Line Spacing control
function fnLineSpacing()
{
	fLineSpacing = !fLineSpacing;
	draw();
}

// when user clicks char to adjust maatraa
function adjustCharLen()
{
	var iChr = parseInt(this.getAttribute("id").substring(4));
	var iLine = parseInt(this.parentNode.getAttribute("id").substring(5));
	var kk = 0;
	oPoem.adjustCharMaatraa(iLine,iChr);
	draw();
}

// when free verse suppport is on
// allows users to join multiple lines together for 
// getting total maatraa count of a set of lines
function markCompositeLine()
{
	// line clicked
	let i = parseInt(this.parentNode.getAttribute("id").substring(5));

	// if anything before last line
	// if not marked as composite
	if ((i < oPoem.lines.length-1) && (!oPoem.lines[i+1].isComposite))
	{
	  oPoem.setComposite(i+1); // why is the next line marked composite? but it works
	  draw();
	} 
}

function unmarkCompositeLine()
  {
    // line clicked
    var i = parseInt(this.parentNode.getAttribute("id").substring(5));
    // toggle composite line setting
    // if true, the line is composite with top
    if (i > 0)
    {
      oPoem.setComposite(i); 
      draw();
    } 
  }

function fnBaseCountChange()
  {
    let baseC = parseInt(document.getElementById("baseCount").value);
    if (baseC > 0)
    {
      if (baseC != oPoem.baseCount)
      {
        oPoem.setBaseCount(baseC);
        draw();
      }
    }
    else
    {
      document.getElementById("baseCount").value = prevBaseCount;
    }
  }

function fnGhazal()
  {
    fGhazal = !fGhazal;
    if (fGhazal)
    {
      document.getElementById("chkFreeVerse").disabled = true;
      oPoem.calculateRadeef();
      oPoem.calculateKaafiyaa();
    }
    else
    {
      document.getElementById("chkFreeVerse").disabled = false;
    }
    // console.log(oPoem);
    draw();
  }

// used for minification
// https://javascript-minifier.com/