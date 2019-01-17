var AMLTranslator = (function () {
  amlTranslator = {};
  amlTranslator.translate = function (input) {

    var outputArr = []; // The final array which is going to output. All the strings are going to pushed here in a queue manner.
    var tempChunk = ""; // temporary chunk of the charaters which are found before any ending literals
    var isStrong = false; // to check whether the current text is strong or not
    var isEM = false; // to check whether the current text is EM or not.

    for (var i = 0; i < input.length; i++) {

      if (input.substring(i, i + 3) == "^!%") { //strong closer  --- i = ^ and i+2 = %
        isStrong = false; // strong closer is ended so the status turned to false.
        if (isEM) { // if any EM tag is open, then we will close it first and close the strong and after that open EM again
          outputArr.push(tempChunk, '</EM></STRONG><EM>');     // storing to the final array, the temporary chunk and the ending literals
        } else { // if EM is not open, then only close strong 
          outputArr.push(tempChunk, '</STRONG>');
        }
        tempChunk = ""; //initiate the temporary chunk again as the prev chunk is already inserted.
        i += 2; //increment to pass the current AML element ^!%

      } else if (input.substring(i, i + 2) == "^%") { //strong opener  --- i = ^ and i+1 = %
        isStrong = true;
        outputArr.push(tempChunk, '<STRONG>'); // storing to the final array, the temporary chunk and the starting literals
        tempChunk = ""; //initiate the temporary chunk again as the prev chunk is already inserted.
        i += 1; //increment to pass the current AML element ^%

      } else if (input.substring(i, i + 3) == "^!~") { //EM closer  --- i = ^ and i+2 = ~
        isEM = false;
        if (isStrong) {// if any Strong tag is open, then we will close it first and close the EM and after that open Strong again
          outputArr.push(tempChunk, '</STRONG></EM><STRONG>');
        } else {  // if Strong is not open, then only close EM 
          outputArr.push(tempChunk, '</EM>');
        }
        tempChunk = "";
        i += 2;  //increment to pass the current AML element ^!~

      } else if (input.substring(i, i + 2) == "^~") { //EM opener  --- i = ^ and i+1 = ~
        isEM = true;
        outputArr.push(tempChunk, '<EM>');
        tempChunk = "";
        i += 1;

      } else { //if there is no eml found, just the regular text
        tempChunk = tempChunk.concat(input.charAt(i));
        if (i == input.length - 1) { //this will add the final text chunk to the array
          outputArr.push(tempChunk);
        }
      }
    }

    return outputArr.join(""); //join the elements of the array into a string before returning

  };

  return amlTranslator;

}());

// Make translator available via “require” in Node.js
if (module.exports) {
  module.exports = AMLTranslator;
}
