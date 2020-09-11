/* issues with hpv 4
half letter black square not drawn
poem text in forefront so clicking box to change box width is tough
*/

/* primary changes compared to v3
single color (no different colors as per consonant)
square or double width rectangle for all vowels
removed svg border from top, left, right
decreased 
1. charW from 24 to 20, 
2. line spacing from 7 to 5, 
3. maatraa count position charW/2 after line end instead of charW
*/

  var charW = 20; // decrease charW to 20 from 24 earlier
  var charH = 20; // decrease charW to 20 from 24 earlier
  var paddingLeft = 10;
  var lineSpacing = 5;
  var mode = "analyze";
  var showText = true;
  var prevText = "";
  var prevBaseCount = 1;
  var fLineSpacing = true;
  var fFreeVerse = false;
  var selWord = 1;
  var chars = [];
  var maxLen = 0;
  var maxLineLen = 0;
  var compositeLinesMarkingA = [];
  var fGhazal = false;
  var radeef = '';
  var radeefArray = [];
  var radeefTruncated = 0;

  // this is where the beauty manifestation starts!
  function visualize()
  {
    splitNprocessPoem();

    if (fFreeVerse)
      initializeCompositeLines();

    if (fGhazal)
    {
      calculateRadeef();
      calculateKaafiyaa();
    }

    draw();
    document.getElementById("divControls").style.display = "block";
  }

  // sometimes the consonant char may be a pure vowel
  function joinCharConsonantVowel(c,v) 
  {
    if (c==v)
      return v; // c is also a vowel - like आ आ
    if (v == 'अ')
      return c; // could be a case of न अ 
    return c+v;
  }

  function calculateRadeef() 
  {
    // chars array structure
    // 1st d: line - array
    // 2nd d: the alphabet units - array
    // 3rd d: 6 element info about each alphabet
    // 0: the alphabet
    // 1: the maatraa
    // 2: vowel or consonant - if vowel: 0, if consonant, which consonant line
    // 3: whicheth vowel
    // 5: cumulative length

    radeef = '';
    radeefArray = [];
    radeefTruncated = 0;

    var radeef1, radeef2;
    var linelen1,linelen2;
    var linelen1 = chars[0].length;
    var linelen2 = chars[1].length;

    var foundRadeefEnd = false;
    var i = linelen1 - 1; // first line index
    var j = linelen2 - 1; // second line index

    while ((!foundRadeefEnd) && (i >= 0) && (j >= 0))
    {
      radeef1 = joinCharConsonantVowel(chars[0][i][0],chars[0][i][1]);

      radeef2 = joinCharConsonantVowel(chars[1][j][0],chars[1][j][1]);

      if (radeef1 == radeef2)
      {
        radeef = radeef1 + radeef;
        radeefArray[radeefArray.length] = [];
        radeefArray[radeefArray.length - 1][0] = chars[0][i][0];
        radeefArray[radeefArray.length - 1][1] = chars[0][i][1];
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
    var realRadeef = radeef.substr(radeef.indexOf(' ')+1);
    // console.log(radeef);

    // truncate radeefArray too
    // if clause implies a truncation did occur in the above substr code, and hence array has to be truncated 
    if (radeef !== realRadeef) 
    {
      console.log('radeef truncated');
      radeefTruncated = 1;
      for (i = radeefArray.length - 1; i >= 0 ; i--) 
      {
        if (radeefArray[i][0] == " ") break;
      }
      radeefArray.length = i;
      radeef = realRadeef;
    }
    
    // the characters in this radeefArray is in reverse order
    // console.log('radeef array');
    // console.log(radeefArray);
    var radeefArrayLen = radeefArray.length;
    // now mark radeef chars in all relevant lines
    for (var i = 0; i < chars.length; i++) {
      // console.log(i);
      var supposedlyRelevantLine = false;
      // first 2 lines
      if (i<=1) supposedlyRelevantLine = true;
      // intermediate line followed by blank line
      if ((i>1) && (i<(chars.length-1)) && (chars[i+1].length==0)) supposedlyRelevantLine = true;
      // last line
      if (i==(chars.length-1)) supposedlyRelevantLine = true;
      var linelen = chars[i].length;
      if ((supposedlyRelevantLine) && (linelen > radeefArrayLen))
      {
        
        for (var j = 0; j < radeefArrayLen; j++) {
          if ((radeefArray[j][0] == chars[i][linelen-1-j][0]) && (radeefArray[j][1] == chars[i][linelen-1-j][1]))
            chars[i][linelen-1-j][6] = 'r';
          else
            break;
        }
        // console.log('line '+i);
        // console.log(chars[i]);
        // break;
      }
    }
  }

  function originalVowel(c)
  {
    switch(c)
    {
      case " ": case ",":
        return " ";
      case "अ": 
        return "अ";
        break;
      case "आ": case "ा":
        return "आ";
        break;
      case "इ": case "ि":
        return "इ";
        break;
      case "ई": case "ी":
        return "ई";
        break;
      case "उ": case "ु":
       return "उ";
        break;
      case "ऊ": case "ू":
        return "ऊ";
        break;
      case "ए": case "े":
        return "ए";
        break;
      case "ऐ": case "ै":
        return "ऐ";
        break;
      case "ओ": case "ो":
        return "ओ";
        break;
      case "औ": case "ौ":
        return "औ";
        break;
      case "ृ":
        return "ृ";
        break;
      default:
        return -1;
    }
    return -1;
  }

  function calculateKaafiyaa()
  {
    var radeefArrayLen = radeefArray.length;
    var foundKaafiyaaEnd = false;
    var kaafiyaa,kaafiyaa1, kaafiyaa2;
    var kaafiyaaArray = [];
    var linelen1 = chars[0].length;
    var linelen2 = chars[1].length;
    var i = linelen1 - 1 - radeefArrayLen; // first line index
    var j = linelen2 - 1 - radeefArrayLen; // second line index

    while ((!foundKaafiyaaEnd) && (i >= 0) && (j >= 0))
    {
      kaafiyaa1 = originalVowel(chars[0][i][1]);

      kaafiyaa2 = originalVowel(chars[1][j][1]);
      console.log(kaafiyaa1);
      console.log(kaafiyaa2);
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
    if (kaafiyaaArray[0]==" ")
      kaafiyaaArray.splice(0,1);
    console.log(kaafiyaaArray);

    var kaafiyaaArrayLen = kaafiyaaArray.length;
    var radeefArrayLen = radeefArray.length;

    // now mark kaafiyaa chars in all relevant lines
    for (var i = 0; i < chars.length; i++) {
      // console.log(i);
      var supposedlyRelevantLine = false;
      // first 2 lines
      if (i<=1) supposedlyRelevantLine = true;
      // intermediate line followed by blank line
      if ((i>1) && (i<(chars.length-1)) && (chars[i+1].length==0)) supposedlyRelevantLine = true;
      // last line
      if (i==(chars.length-1)) supposedlyRelevantLine = true;
      var linelen = chars[i].length;
      if ((supposedlyRelevantLine) && (linelen > (radeefArrayLen+kaafiyaaArrayLen+radeefTruncated)))
      {
        
        for (var j = 0; j < kaafiyaaArrayLen; j++) {
          if (kaafiyaaArray[j] == originalVowel(chars[i][linelen-1-radeefArrayLen-radeefTruncated-j][1]))
            chars[i][linelen-1-radeefArrayLen-radeefTruncated-j][6] = 'k';
          else
            break;
        }
        // console.log('line '+i);
        // console.log(chars[i]);
        // break;
      }
    }
  }

  function initializeCompositeLines()
  {
    for (i = 0; i < chars.length; i++)
    {
      compositeLinesMarkingA[i] = [];
      if (chars[i].length>0)
      {
        compositeLinesMarkingA[i][0] = chars[i][chars[i].length-1][5];  // total count of individual line
        compositeLinesMarkingA[i][1] = false; // is or is not composite
      }
      else
      {
        compositeLinesMarkingA[i][0] = 0;
        compositeLinesMarkingA[i][1] = false;
      }
    }
  }

  function calculateCompositeLines()
  {
    var compositeInProgress = false;
    var compositeLines = [];
    if (chars.length > 1)
    {
      for (i = 1; i < chars.length; i++)
      {
        if (compositeLinesMarkingA[i][1])  // is part of composite line
        {
          if (!compositeInProgress) // new composite line
          {
            compositeInProgress = true;
            var len = compositeLines.length;
            compositeLines[len] = [];
            compositeLines[len][0] = i-1; // starting position, line index is the *previous*
            compositeLines[len][1] = chars[i-1][chars[i-1].length-1][5];  // total maatraa count of prev (starting) line
            compositeLines[len][1] += chars[i][chars[i].length-1][5]; // add total maatraa count of current line
          }
          else // in progress composite line
          {
            // just add to in progress composite line
            var len = compositeLines.length;
            //console.log(i);
            compositeLines[len-1][1] += chars[i][chars[i].length-1][5];
          }
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
    if (compositeLines.length > 0)
      return compositeLines;
    else
      return false;
  }

  // separate each line and character
  function splitNprocessPoem()
  {
    var pom = document.getElementById("pom").value;
    var lines = pom.split("\n");
    var oldLines = prevText.split("\n");
    var i = 0, k = 0;
    var charCode = 0;
    var len = 0;
    maxLineLen = lines.length;
    for (i = 0; i < maxLineLen; i++) // process each line - i = line index
    {
      // do not process old lines
      if ((i < oldLines.length) && (oldLines[i] == lines[i]))
      {
        // in the list of characters of the line
        // last element added with val "old"
        chars[i][chars[i].length] = "old";
      }
      else  
      // process only new edited lines
      // go through each character in the line and handle differently
      // based on what category of character it is
      // to set first 2 info slots
      {
        chars[i] = [];
        for (k=0;k<lines[i].length;k++) // process each char: k = char index
        {
          charCode = lines[i].charCodeAt(k);
          len = chars[i].length; // existing #of-chars - to add the next char
          if ((charCode >= 2366) && (charCode <= 2381)) // maatraa
          {
            // new element not added to array
            // the vowel part of previous element 
            // modified to update maatraa
            chars[i][len-1][1] = lines[i].substring(k,k+1);
            chars[i][len-1][3] = getVowData(chars[i][len-1][1]);
          }
          else // not maatraa - true new char
          {
            // space / comma ------------------------ OR vowel
            if (((charCode == 32)||(charCode == 44)) || ((charCode >= 2309) && (charCode <= 2324)))
            {
              chars[i][len] = ["",""];
              chars[i][len][0] = lines[i].substring(k,k+1);
              chars[i][len][1] = lines[i].substring(k,k+1);
            }
            
            // consonant --------------------------------- OR consonant with dot at bottom
            if (((charCode >= 2325) && (charCode <= 2361)) || ((charCode >= 2392) && (charCode <= 2399)))
            {
              chars[i][len] = ["",""];
              chars[i][len][0] = lines[i].substring(k,k+1);
              chars[i][len][1] = "अ";
            }

            // anusvaar (the bindi on top) which sometimes is short-cut for half letter
            if (charCode == 2306) 
            {
              chars[i][len] = ["",""];
              chars[i][len][0] = lines[i].substring(k,k+1);
              chars[i][len][1] = "्"; // halant
            }

            // now for the newly separated characters, get the number codes
            // of the consonants and vowels
            len = chars[i].length-1;
            chars[i][len][2] = getConsData(chars[i][len][0]);
            chars[i][len][3] = getVowData(chars[i][len][1]);
            chars[i][len][4] = 0; // len
            chars[i][len][5] = 0; // cum len  
          }          
        }

        chars[i][chars[i].length] = "new"; // last element, the marker "new"

      }
    }
    // now iterate through the whole chars structure again 
    // and assign lengths for new lines
    // lengths for individual characters and cumulative length
    // for whole line
    // this is the place where the default length for half maatraa 
    // is also determined
    // refactor note: maybe this loop can be merged with the above loop
    // to prevent needless iteration - but the code should not become too
    // unwieldly 
    for (i = 0; i < chars.length; i++)
    {
      // calculate lengths - individual and cumulative
      if (chars[i][chars[i].length-1] == "new")
      {
        for (k=0;k<chars[i].length-1;k++)
        {
          // assign length as per vowel code
          switch (chars[i][k][3])
          {
            case 1: case 3: case 5: case 11:
              chars[i][k][4] = 1;
              break;
            case 2: case 4: case 6: case 8: case 10: case 7: case 9: case 10:
              chars[i][k][4] = 2;
              break;
            case -1: // no vowel, most likely half maatraa
              {
                // decide half maatraa length
                if (k == 0) // first letter of line
                {
                  if (k == chars[i].length-2) // last letter of line
                  {
                    chars[i][k][4] = halfLetterLen(0,chars[i][k],0);
                  }
                  else  // not last letter
                  {
                    chars[i][k][4] = halfLetterLen(0,chars[i][k],chars[i][k+1]); 
                  }
                }
                else  // not first letter
                {
                  if (k == chars[i].length-2) // last letter of line
                  {
                    chars[i][k][4] = halfLetterLen(chars[i][k-1],chars[i][k],0);
                  }
                  else  // not last letter
                  {
                    chars[i][k][4] = halfLetterLen(chars[i][k-1],chars[i][k],chars[i][k+1]); 
                  }
                }
              }
          }
          // assign cumulative length
          if (k == 0)
          { chars[i][k][5] = chars[i][k][4]; }
          else
          { chars[i][k][5] = chars[i][k-1][5] + chars[i][k][4]; }
        }

        if (chars[i].length > 1)
        {
          if (chars[i][k-1][5] > maxLen)
          {
            maxLen = chars[i][k-1][5];
          }
        }
      }
      chars[i].pop();
    }
    // truncate removed lines from chars structure
    // if now "pom" has lesser lines
    if (lines.length < chars.length)
    {
      chars.length = lines.length;
    }
    //console.log(chars);
    prevText = pom;
  }

  // which vowel - vowel to vowel number/code
  function getVowData(char)
  {
    switch(char)
    {
      case " ": case ",":
        return -10;
      case "अ": 
        return 1;
        break;
      case "आ": case "ा":
        return 2;
        break;
      case "इ": case "ि":
        return 3;
        break;
      case "ई": case "ी":
        return 4;
        break;
      case "उ": case "ु":
       return 5;
        break;
      case "ऊ": case "ू":
        return 6;
        break;
      case "ए": case "े":
        return 7;
        break;
      case "ऐ": case "ै":
        return 8;
        break;
      case "ओ": case "ो":
        return 9;
        break;
      case "औ": case "ौ":
        return 10;
        break;
      case "ृ":
        return 11;
        break;
      default:
        return -1;
    }
    return -1;
  }

  // vowel or consonant, if consonant, which line in varnmala (consonant code)
  function getConsData(char)
  {
    switch(char)
    {
      case " ": case ",":
        return -10;
      case "अ": case "आ": case "इ": case "ई": case "उ": case "ऊ": 
      case "ए": case "ऐ": case "ओ": case "औ":
        return 0;
        break;
      case "क": case "ख": case "ख़": case "ग": case "घ": case "ग़": case "ङ":
        return 1;
        break;
      case "च": case "छ": case "ज": case "झ": case "ञ": case "ज़":
        return 2;
        break;
      case "ट": case "ठ": case "ड": case "ढ": case "ण": case "ड़": case "ढ़":
        return 3;
        break;
      case "त": case "थ": case "द": case "ध": case "न": case "ं":
        return 4;
        break;
      case "प": case "फ": case "ब": case "भ": case "म": case "फ़":
        return 5;
        break;
      case "य": case "र": case "ल": case "व":
        return 6;
        break;
      case "श": case "ष": case "स": case "ह":
        return 7;
        break;
      default:
        return -1;
    }
    return -1;
  }

  // color determined by consonant
  function conColor(c) {
    var color = "";
    var fillOp = "0.7";
    // set all consonants to a light blue
    color = "rgb(0,220,255)"; // blue 
    fillOp = "0.5";
    /*switch(c)  // which consonant
    { 
      case 0: // vowel
        color = "grey";
        break;
      case 1: // ka kha ga ...
        color = "rgb(255,0,0)"; //red
        fillOp = "0.65"
        break;
      case 2: // cha chha ja jha ...
        color = "rgb(255,165,0)"; // orange
        break;
      case 3: // Ta THa Da Dha ...
        color = "rgb(255,255,0)"; // yellow
        break;
      case 4: // ta tha da dha ...
        color = "rgb(0,255,0)"; // green
        fillOp = "1.0";
        break;
      case 5: // pa pha ba bha
        color = "rgb(0,220,255)"; // blue
        fillOp = "1.0";
        break;
      case 6: // ya ra la va
        color = "rgb(0,64,255)";  // indigo
        break;
      case 7: // sha sha sa ha
        color = "rgb(143,0,255)"; // violet
        break;
      default:
        color = "black";
    }*/
    return [color,fillOp];
  }

  // style of char blocks - including color
  // c - the character to be styled
  // showConColor - boolean - whether the color is to be displayed or not
  function styleCharBlock(c,colorBy)
  {

    // "c" is the character array
    // 0: the alphabet
    // 1: the maatraa
    // 2: vowel or consonant - if vowel: 0, if consonant, which consonant line
    // 3: whicheth vowel
    // 4: individual length
    // 5: cumulative length
    // 6: this index may or may not exist - indicating radeef(r) or kaafiyaa (k)
    if (c[3] === -10) // do not display space, comma
      return "display: none";

    var color = "white";
    var strokeOp = "0.3";
    var strokeW = 1;
    var fillOp = "0.7";

    // call conColor to determine color and opacity as per consonant
    if (colorBy == 'consonant')
    {
      var conColorResult = conColor(c[2]);
      color = conColorResult[0];
      fillOp = conColorResult[1];
    }
    if ((colorBy == 'ghazal') && (c.length>6))
    {
      if (c[6] == 'r') // is a radeef char
      {
        color = "rgb(0,220,255)"; // blue
        fillOp = "1.0";
      }
      if (c[6] == 'k') // is a kaafiyaa char
      {
        color = "rgb(0,255,0)"; // green
        fillOp = "1.0";
      }
    }
    
    // unknown vowel, individual length unknown/0
    // what are some examples when this occurs?
    // 1 eg. ऋ as in rishi
    // any other examples? 
    if ((c[3] == -1) && (c[4] == 0))
    {
      //console.log(c);
      color = "black";
      strokeOp = "1";
      fillOp = "0.7";    
    }

    return "fill: "+color+"; fill-opacity: " + fillOp + ";stroke:black; stroke-width: "+strokeW+"; stroke-opacity: "+strokeOp;
  }
  
  // shapes' shape determined by vowel
  function vowPath(d,i)
  {
    var p = "";
    var x = ((d[5]-d[4])*charW);  // what is x?
    var w = charW*d[4];
    var h = charH;
    // set all vowels to a to square or double width rectangle
    p = "M"+x+",0 L"+x+","+h + " L"+(x+w)+","+h+" L"+(x+w)+",0 z";
    /*switch(d[3])  // which vowel
    {
      case -1: // unknown
        if (d[4] == 0)
        {
          //p = "M"+x+",0m0,3a3,3 0 1,1 0,-6a3,3 0 1,1 0,6z";
          w = 4;  // *** why is this hardcoded
          h = 4;  // *** why is this hardcoded
          x = x-2;  // what is this?
          p = "M"+x+",0 L"+x+",-"+h + " L"+(x+w)+",-"+h+" L"+(x+w)+",0 z";
        }
        if (d[4] == 1)
        {
          p = "M"+x+",0 L"+x+","+h + " L"+(x+w)+","+h+" L"+(x+w)+",0 z";
        }
        break;
      case 1: case 2: case 11: // a aa ri
        p = "M"+x+",0 L"+x+","+h + " L"+(x+w)+","+h+" L"+(x+w)+",0 z";
        break;
      case 3: // इ
        p = "M"+x+","+h+" L"+x+","+(h/2)+" L"+(x+(w/2))+",0"+" L"+(x+w)+","+(h/2)+" L"+(x+w)+","+h+" z";
        break;
      case 4: // ई
        p = "M"+x+","+h+" L"+(x+(w/2))+",0"+" L"+(x+w)+","+h+" z";
        break;
      case 5: // उ
        //M20,180 L20,190 A10,10 0 0,0 40,190 L40,180 z
        p = "M"+x+",0 L"+x+","+(h/2)+"A"+(w/2)+","+(w/2)+" 0 0,0 "+(x+w)+","+(h/2)+" L"+(x+w)+",0 z";
        break;
      case 6: // ऊ
        if (w == charW)
          p = "M"+x+",0 A"+(w/2)+","+w+" 0 0,0 "+(x+w)+",0 z";  
        else
          p = "M"+x+",0 A"+(w/2)+","+(w/2)+" 0 0,0 "+(x+w)+",0 z";
        break;
      case 7: // ए
        p = "M"+x+",0 L"+x+","+h+" L"+(x+w)+","+h+" L"+(x+w)+","+(h/2)+" z";
        break;
      case 8: // ऐ
        p = "M"+x+",0 L"+x+","+h+" L"+(x+w)+","+h+" z";
        break;
      case 9: // ओ
        p = "M"+x+","+h+" L"+x+","+(h/2)+"A"+(w/2)+","+(h/2)+" 0 0,1 "+(x+w)+","+(h/2)+" L"+(x+w)+","+h+" z";
        break;
      case 10: // औ
        p = "M"+x+","+h+" A"+(w/2)+","+h+" 0 0,1 "+(x+w)+","+h+" z";
        break;
      default: // unknown
        p = "M"+x+",0 L"+x+","+h + " L"+(x+w)+","+h+" L"+(x+w)+",0 z";
        break;
    }*/
    return p;
  }

  // chars array structure
  // 1st d: line - array
  // 2nd d: the alphabet units - array
  // 3rd d: 6 element info about each alphabet
  // 0: the alphabet
  // 1: the maatraa
  // 2: vowel or consonant - if vowel: 0, if consonant, which consonant line
  // 3: whicheth vowel
  // 4: individual length
  // 5: cumulative length

  // when user clicks char to reassign length
  function adjustCharLen()
  {
    //console.log("adj");
    var k = parseInt(this.getAttribute("id").substring(4));
    var i = parseInt(this.parentNode.getAttribute("id").substring(5));
    var kk = 0;
    if ((chars[i][k][3]%2 == 0) || ((chars[i][k][3]>6) && (chars[i][k][3]<11)))
    {
      if (chars[i][k][4] == 1)
      {
        chars[i][k][4] = 2;
        for (kk = k; kk < chars[i].length; kk++)
          chars[i][kk][5] = chars[i][kk][5]+1;
        if (chars[i][kk-1][5] > maxLen)
            maxLen = chars[i][kk-1][5];
        draw();
        return;
      }
      if (chars[i][k][4] == 2)
      {
        chars[i][k][4] = 1;
        for (kk = k; kk < chars[i].length; kk++)
          chars[i][kk][5] = chars[i][kk][5]-1;
        draw();
        return;
      }
    }
    if (chars[i][k][3] == -1) // half letter
    {
      if (chars[i][k][4] == 0)
      {
          chars[i][k][4] = 1;
          for (kk = k; kk < chars[i].length; kk++)
            chars[i][kk][5] = chars[i][kk][5]+1;
          if (chars[i][kk-1][5] > maxLen)
            maxLen = chars[i][kk-1][5];
          draw();
          return;
      }
      if (chars[i][k][4] == 1)
      {
          chars[i][k][4] = 0;
          for (kk = k; kk < chars[i].length; kk++)
            chars[i][kk][5] = chars[i][kk][5]-1;
          draw();
          return;
      }
    }
  }

  // when free verse suppport is on
  // allows users to join multiple lines together for 
  // getting total maatraa count of a set of lines
  function markCompositeLineTextDash()
  {
    // line clicked
    var i = parseInt(this.parentNode.getAttribute("id").substring(5));
    
    // if anything before last line
    // if not marked as composite
    if ((i < compositeLinesMarkingA.length-1) && (!compositeLinesMarkingA[i+1][1]))
    {
      compositeLinesMarkingA[i+1][1] = !compositeLinesMarkingA[i+1][1]; 
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
      compositeLinesMarkingA[i][1] = !compositeLinesMarkingA[i][1]; 
      draw();
    } 
  }

  // helper for draw function to place text in correct position
  function charTxtPos(d,i)
  {
    var x = ((d[5]-d[4])*charW);
    //console.log(d[5]);
    var w = charW*d[4];
    return x+(w/2);
  }

  // helper for draw function to show text
  function charTxt(d)
  {
    var txt = "";
    if (d[2] != -10)  // non hindi character
    {
      if ((d[2] == 0)||(d[3] == 1))
      {
        txt = d[0];
      }
      else
      {
        txt = d[0]+d[1];
      }
    }
    return txt;
  }

  // determine when half letter will have 0 or 1 maatraa
  // the logic for default handling - which the user can always override
  // p = previous letter (consonant+vowel array structure)
  // c = current letter (consonant+vowel array structure) - for which the len is to be 
  // determined
  // n = next letter (consonant+vowel array structure)
  function halfLetterLen(p,c,n)
  {
    if (p === 0)  // no previous letter, half maatraa is first letter of line
      return 0;
    if (p[2] === -10) // no previous letter, half maatraa is first letter of word
      return 0;
    pLD = ""; // previous is laghu or deergha; 
    nLD = ""; // next is laghu or deergha;

    // special combinations ----------------
    if ((c[0] == "म") && (n[0] == "ह"))
      return 0;
    if ((c[0] == "न") && (n[0] == "ह"))
      return 0;
    // end special combinations ------------

    switch (p[3]) // previous vowel code
    {
      case 1: case 3: case 5: case 11: // previous letter is laghu
        pLD = "l";
        break;
      case 2: case 4: case 6: case 8: case 10: case 7: case 9: case 10:
        pLD = "d";
        break;
    }
    if (pLD === "l") // previous is laghu
    {
      return 1;
    }
    switch (n[3]) // next vowel code
    {
      case 1: case 3: case 5: case 11: // next letter is laghu
        nLD = "l";
        break;
      case 2: case 4: case 6: case 8: case 10: case 7: case 9: case 10:
        nLD = "d";
        break;
    }
    if ((pLD === "d") && (nLD === "d")) // both side deergha
    {
      return 1;
    }
    return 0;
  }

  function drawCompositeLine(drawWhat,i)
  {
    //console.log(i);
    //var i = parseInt(this.parentNode.getAttribute("id").substring(5));
    if (drawWhat == "x1")
    {
      if (i==0)
        return charW*maxLen+(charW*2);
      if (compositeLinesMarkingA[i][1])
        return charW*maxLen+(charW*2.3);        
      else
        return charW*maxLen+(charW*2);
    }
    if (drawWhat == "y1")
    {
      if (compositeLinesMarkingA[i][1])
      {
        if (fLineSpacing)
          return -3;
        else
          return 0;
      }               
      else
        return charH;
    }
    if (drawWhat == "styleSmall")
    {

      if (compositeLinesMarkingA[i][0] == 0)  // empty line
        return "display:none;";

      return "stroke:black;stroke-width:4;"
    }
    if (drawWhat == "styleMain")
    {

      if ((compositeLinesMarkingA[i][0] == 0) || (!compositeLinesMarkingA[i][1]))  // empty line || not composite
        return "display:none;";

      return "stroke:black;stroke-width:4;"
    }
    if (drawWhat == "styleCompositeLineMaatraa")
    {
      var baseC = parseInt(document.getElementById("baseCount").value);
      if (baseC > 0)
      {
        if ((i[1] % baseC) == 0)
        {
          return "fill:black";
        }
        else
        {
          return "fill:red";
        }
      }
      return "fill:black";
    }
    if (drawWhat == "compositeRemainderValue")
    {
      var baseC = parseInt(document.getElementById("baseCount").value);
      if (baseC > 1)
      {
        var remainder = i[1] % baseC;
        if (remainder != 0)
        {
          var result = i[1]/baseC;
          var whole = parseInt(result);
          var remainderInDecimal = result - whole;
          if (remainderInDecimal <= 0.5)
            return "+"+remainder;
          else
            return "-"+(((whole+1)*baseC)-i[1]);
        }
      }
      return "";
    }
  }

  // the D3 draw dance!
  function draw()
  {
     var chart = d3.select("#chart");
     chart.select("svg").remove();
     var svg = chart.append("svg")
                  .attr("width", function() {return (fFreeVerse?charW*maxLen+120:charW*maxLen+100);})
                  .attr("height", ((maxLineLen*(charW+lineSpacing))+(charW))+charW)
                  .attr("style","border-bottom: solid 1px #ddd;");

    // create the "g"s (svg groups) for each line
    if (fLineSpacing)
    {
      var g = svg.selectAll("g")
        .data(chars)
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
        .data(chars)
        .enter().append("svg:g")
          .attr("transform", function(d,i) 
            { return "translate(" + paddingLeft + "," + ((i*(charH))+(charH)) + ")" })
          .attr("id", function(d,i) { return "gLine"+i});
    }

    g.selectAll("path")
      .data(function(d) {return d;} )
      .enter().append("path")
        .attr("id", function(d,i) {return "char"+i})
        .attr("style", function(d,i) {
          if (fGhazal)
            return styleCharBlock(d,'ghazal');
          else
            return styleCharBlock(d,'consonant');
        })
        .attr("d", function(d,i) {return vowPath(d,i);})
        .attr("title", function(d,i) {return d[0]+d[1];})
        .on("click",adjustCharLen);

    if (showText)
    {
        g.selectAll("text")               // char text
          .data(function(d) {return d;} )
          .enter().append("svg:text")
            .attr("y", charH-2)
            .attr("x", function(d,i) {return charTxtPos(d);})
            .attr("class", "graphText3")
            //.attr("dominant-baseline", "central")
            .attr("text-anchor", "middle")
            .text(function(d) {return charTxt(d);});
    }
    
    // line total maatraa
    if (fFreeVerse) // line maatraa count numbers are clickable
    {
      g.append("svg:text")            // line total maatraa
      .attr("y", charH)
      .attr("x", function(d) {return charW*maxLen+charW;})
      //.attr("dominant-baseline", "central")
      .attr("class", "graphText3")
      .text(function(d) { return (d.length > 0) ? d[d.length-1][5] : "";})
      .on("click",markCompositeLineTextDash);

      // small dash beside maatraa count
      g.append("svg:line")
        //.attr("x1", function(d) {return charW*maxLen+(charW);})
        .attr("x1", function(d,i) {return charW*maxLen+(charW*2);})
        .attr("y1", function(d,i) {return charH+2;})
        .attr("x2", function(d) {return charW*maxLen+(charW*2.3);})
        .attr("y2", charH+2)
        .attr("style", function(d,i) {return drawCompositeLine("styleSmall",i);})
        .on("click",markCompositeLineTextDash);

      // composite line marker
      g.append("svg:line")
        //.attr("x1", function(d) {return charW*maxLen+(charW);})
        .attr("x1", function(d,i) {return drawCompositeLine("x1",i);})
        .attr("y1", function(d,i) {return drawCompositeLine("y1",i);})
        .attr("x2", function(d) {return charW*maxLen+(charW*2.3);})
        .attr("y2", charH+2)
        .attr("style", function(d,i) {return drawCompositeLine("styleMain",i);})
        .on("click",unmarkCompositeLine);
    }    
    else  // normal - numbers are not clickable
    {
      g.append("svg:text")            // line total maatraa
      .attr("y", charH)
      .attr("x", function(d) {return charW*maxLen+(charW/2);}) // decreased distance of maatraa count. was charW. is charW/2 now
      //.attr("dominant-baseline", "central")
      .attr("class", "graphText3")
      .text(function(d) { return (d.length > 0) ? d[d.length-1][5] : "";});
    }

    // composite line total maatraa
    drawCompositeNumbers();
      
  } // end draw

  function drawCompositeNumbers()
  {
    if (fFreeVerse)
    {
      var dataComposite = calculateCompositeLines();
      var chart = d3.select("#chart");
      var svg = chart.select("svg");
      //console.log("calculated compositeLines");
      //console.log(calculateCompositeLines());
      if (fLineSpacing)
      {
        var compositeLTotal = svg.selectAll(".compositeCountT")
          .data(dataComposite)
          .enter().append("svg:text")
          .attr("y", function(d) {return ((d[0]*(charH+lineSpacing))+(charH+lineSpacing)+charH);})
          .attr("x", function(d) {return paddingLeft + 8 + charW*maxLen+(charW*2);})
          .attr("class", "compositeCountT")
          .attr("style", function(d) {return drawCompositeLine("styleCompositeLineMaatraa",d);})
          .text(function(d) {return d[1];});

        var compositeLRemainder = svg.selectAll(".compositeCountR")
          .data(dataComposite)
          .enter().append("svg:text")
          .attr("y", function(d) {return ((d[0]*(charH+lineSpacing))+(charH+lineSpacing)+charH)+10;})
          .attr("x", function(d) {return paddingLeft + 8 + charW*maxLen+(charW*2)+20;})
          .attr("class", "compositeCountR")
          .attr("style", function(d) {return "fill:red;font-size:80%";})
          .text(function(d) {return drawCompositeLine("compositeRemainderValue",d);});
      }
      else
      {
        var compositeLTotal = svg.selectAll(".compositeCountT")
          .data(dataComposite)
          .enter().append("svg:text")
          .attr("y", function(d) {return ((d[0]*charH)+charH+charH);})
          .attr("x", function(d) {return paddingLeft + 8 + charW*maxLen+(charW*2);})
          .attr("class", "compositeCountT")
          .attr("style", function(d) {return drawCompositeLine("styleCompositeLineMaatraa",d);})
          .text(function(d) {return d[1];});  

        var compositeLRemainder = svg.selectAll(".compositeCountR")
          .data(dataComposite)
          .enter().append("svg:text")
          .attr("y", function(d) {return ((d[0]*charH)+charH+charH)+10;})
          .attr("x", function(d) {return paddingLeft + 8 + charW*maxLen+(charW*2)+20;})
          .attr("class", "compositeCountR")
          .attr("style", function(d) {return "fill:red;font-size:80%";})
          .text(function(d) {return drawCompositeLine("compositeRemainderValue",d);});  
      }
    }
  }

  function redrawCompositeNumbers()
  {
    //console.log("redraw composite numbers");
    d3.selectAll(".compositeCountT").remove();
    d3.selectAll(".compositeCountR").remove();
    drawCompositeNumbers();
  }

  // toggle ShowText control
  function fnShowText()
  {
    showText = !showText;
    document.getElementById("chkShowText").checked = showText;
    draw();
  }

  // toggle Line Spacing control
  function fnLineSpacing()
  {
    fLineSpacing = !fLineSpacing;
    draw();
  }

  // toggle Free Verse support
  function fnFreeVerseSupport()
  {
    fFreeVerse = !fFreeVerse;
    if (fFreeVerse)
    {
      document.getElementById("chkGhazal").disabled = true;
      document.getElementById("spanFreeVerse").style.display = "inline";
      initializeCompositeLines();
    }
    else
    {
      document.getElementById("chkGhazal").disabled = false;
      document.getElementById("spanFreeVerse").style.display = "none";
    }
    draw();
  }

  function fnGhazal()
  {
    fGhazal = !fGhazal;
    if (fGhazal)
    {
      document.getElementById("chkFreeVerse").disabled = true;
      calculateRadeef();
      calculateKaafiyaa();
    }
    else
    {
      document.getElementById("chkFreeVerse").disabled = false;
    }
    
    draw();
  }

  function fnBaseCountChange()
  {
    var baseC = parseInt(document.getElementById("baseCount").value);
    if (baseC > 0)
    {
      if (baseC != prevBaseCount)
      {
        prevBaseCount = baseC;
        if (fFreeVerse)
        {
          redrawCompositeNumbers();
        }
      }
    }
    else
    {
      document.getElementById("baseCount").value = prevBaseCount;
    }
  }

  // minification used: http://jscompress.com/
  // had to fix ग़ ज़ फ़ ड़ ढ़ after that



