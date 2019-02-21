# LightningSignature
Component to capture signatures and store them as Salesforce files

## Usage

1. To capture signatures, add the following code to your lightning component

```
       <c:CmpSignatureCapture aura:id="sig"
                               name="sig" 
                               fileName="mySignature" />
```
```
Optional parameters are:
* recordId - recordId to link saved file to 
* pen-color - color to use when drawing the signature
* pen-width - numeric 1,2,3 etc. default is 2
* background-color - background color for the canvas
* showSignatureLine - set it to true if you would like a line on the canvas on which to sign
					default it false
					NOTE: when saved to a file, the line will be included
* signatureLine-color - color for the line described above
* showClearButton - default is true. Set it to false if you do not what to show the button to clear 
					the canvas
* showSaveButton - default is true. Set it to false if you do not what to show the button to save 
					the signature
* readOnly - default is false. Set it to true to disable drawing on the canvas. The clear and save buttons 
			will no be displayed in this case.					
```

```
The component has the following methods
* clear - Use to clear the signature from a parent component
* createImage - Returns an html image element containing the signatre
* capture - 1 argument (format) - Valid formats are 'svg', 'svgbase64' and 'image'
			returns the signature in the format sepcified as an array of 2 strings. 
			The first is the mime type and the second is the image data
* createFile - arguments - fileName and recordId (recordId is optional)
			creates a salesforce file and links to recordId if specified
			NOTE: .png will be appended to teh fileName
			If no fileName is specified, file will be called signature.png		
* isEmpty - returns true if nothing is drawn
* loadFile - arguments - fileName OR contentDocumentId. PLEASE SPECIFY ONLY ONE
			Contents of salesforce file are loaded onto the canvas.
			If fileName is specified, the latest version of the ContentVersion with
			Title = fileName is loaded.			
```

```
This component fires the following events that the parent component can handle
* EvtCmpSignatureCleared - when the contents of the signature widget are cleared
* EvtCmpSignatureChanged - when the contents of the signature widget are changed
* EvtCmpSignatureFileCreated - when a salesforce file is created (by the user clicking on the save button)
							This event will pass the name of the file and its ContentDocumentId

All the events will provide the "name" of the signature component so that the parent component can 
differentiate events when there are multiple signature components in the same parent							
```

Please check out the example provided in the "CmpTestSignaturePad" component. This component can be added as quick action on any record page and demos both capturing signatures into salesforce files and loading signatures from salesforce files into the signature widget



## Install using the button below:

<a href="https://githubsfdeploy.herokuapp.com?owner=veenasundara&repo=LightningSignature">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/src/main/webapp/resources/img/deploy.png">
</a>
