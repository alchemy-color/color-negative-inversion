# Color negative conversion

#### Process based on the work by Aaron Buchler https://github.com/abpy/color-neg-resources and Aaron Buchler https://github.com/jackw01/scanlight.
The following process provides a well-informed, accurate, and flexible method for converting negative images to positive in Photoshop. Aaron Buchler's semi-automated method for converting negatives in 32-bit serves as the foundation for this approach, which simplifies and streamlines the workflow. Paper color emulation LUTs are based on publicly available ICC profiles. These profiles were stripped of tonal curves and converted into .cube LUTs compatible with Photoshop.

![DSC07009-2](https://github.com/user-attachments/assets/09767f74-add3-44b5-aac4-98f1294d7668)
Kodak Gold 200 negative shot with a Canon EOS50e and Canon EF 100mm f/2.8. Negative illuminated with an iPad screen, photographed with a Sony A7IV, processed with the method described below.

more at www.alchemycolor.com

contact: info@alchemycolor.com

## 1. Prerequisites

### Installing presets and profiles
Install the XMP preset. This preset reverses the effect of the default tone curve of the Adobe Standard profile. This is a fundamental part of the conversion.

Copy the "🜃 Alchemy Color tools" folder to:
* Mac: Users/[username]/Library/Application Support/Adobe/CameraRaw/Settings/
* Windows: C:\Users\[username]\AppData\Roaming\Adobe\CameraRaw\Settings

## 2. Preparing the negative in Adobe Camera Raw
* Load a RAW file. While experimenting with JPEG scans is possible, the results will generally be inferior.
* For DSLR scans
  * White balance to a known dark neutral area of the photographed scene, a deep shadow for example. A dark photographed color will appear brighter in the negative, hence, look for a bright area in the negative. Don't use the burned film tip and transparent film base as these sit outside the usable dynamic range of the film.
  * Load the “🜃 Adobe Standard to Linear” preset. This preset loads the Adobe Standard DNG profile and a curve that modifies the default tone curve of Adobe Standard to linear.
  * Set color noise reduction to 0 to preserve the natural film grain.
  * Open or export as TIFF 16 bit in REC. 2020 color space.
 
* For DNG images originated from scanner software such as Vuescan.
  * You will probably see the DNG profile set to "Embedded".
  * Don't white balance the raw scan as the embedded DNG profile most likely is empty, thus resulting in inadequate color when setting large white balance swings such as the ones originating from the film base. Density balance will take care of this further down the line.
  * Load the “🜃 Adobe Standard to Linear” preset. This preset won't the Adobe Standard DNG profile as it most likely isn't supported for Vuescan DNGs but the curve that transforms Adobe Standard to linear still proves efficient.

Notes
* A fundamental initial step in this whole process is preserving the linearity of the contrast in the digital photograph of the negative. The curve loaded by this preset draws the reverse shape of the tone curve of the Adobe Standard DNG profile.
* Adobe Standard is used for the sake of compatibility. The vast majority of digital cameras are supported by this standard. When comparing negative inversions made with Adobe Standard versus a custom, highly accurate calibrated profile, the difference is more technical than perceptual.

## 3. Reversing the negative
* Run the "🜃 1. Convert to 32 bit" action. This action will convert the image to 32 bit.
* Use the eyedropper tool to select background and foreground colors. Whenever possible, choose neutral areas within the photographed scene. A color checker image illuminated under a known light source is highly beneficial at this step, as it ensures accurate and consistent color balance for other photos in the roll. Minor white point variations can be adjusted in another layer.
* Pick dark neutral: ALT+click on a neutral, bright part of the negative.
* Pick bright neutral: Click on a neutral, dark part of the negative.
* Run the "🜃 2. Load density balance script" action. This action prompt you to load the `density balance.js` script. File>Scripts>Browse>`density balance.js`. You can add an extra step that records the loading of the script from your local storage.
* It's worth experimenting with different neutral points, especially from other photographs in the same roll. Load other images as a background layer and repeat these steps if you encounter dramatic shifts in white balance. Create a contact sheet to experiment with more than one photograph at once.
* Run the "🜃 3. Negative reversal" action. This action prompt you to load the template containing all the layers necessary for the inversion. You can add an extra step that records the loading of the template from your local storage.

### Usage
1. Adjust the exposure and gamma sliders on the “Exposure/Contrast” layer to extract the full dynamic range of the negative. For very contrasted or dense negatives, start by moving the gamma correction slider to the left to reduce contrast, then lower the exposure. You can preserve some faded blacks at this point. The black point can be restored with the Levels layer upstream.
2. Over and under-exposed parts of the negative fall outside its useful dynamic range. While it may be tempting to recover every bit of information, it is often better to clip these areas to pure black or white. Photoshop doesn't have a histogram in 32 bit mode.
3. If desired, modify the LUT in the “Print Paper Contrast” layer using the provided paper contrast LUTs to achieve lifted blacks, compressed whites, or a combination of both.
4. Change the LUT in the “Print Paper Color” layer to any of the provided paper color LUTs for different color rendering.
5. Set the black and white points on the “Levels” layer. The layer opacity is set to 25% by default to provide a broader operational range.
6. Adjust white balance on the “White Balance” layer using the gray point sampling tool. The layer opacity is set to 50% by default, but you can increase it for a stronger effect.
7. Adjust any other layers as needed.

## Paper contrast LUTs
file|function
-|-
paper_a_fogged black and white.cube    |Black levels are raised and white levels are lowered
paper_a_0% black_fogged white.cube     |Black levels hit 0% and white levels are lowered
paper_a_100% white_fogged blacks.cube  |White levels hit 100% and black levels are raised
paper_a_100% black and white.cube      |White levels hit 100% and black levels hit 0%

## 4. EXPORTING FOR WEB
* For web publishing, run the "🜃 4. Convert for web delivery" action. This will flatten the image, convert th bit depth to 8 bit and the color space to sRGB.

## 5. Creating an XMP profile
Creating the negative conversion XMP profile to be applied to TIFF and RAW files.

* Reverse the negative in Photoshop to taste.
* Run the “🜃 5. Create negative reversal LUT REC.2020” action.
* You will be prompted to open the file "Negative Reversal LUT.png". You can add an extra step that records the loading of the HALD file from your local storage.
* Then you will be prompted to save the file with the embedded LUT. Do not overwrite the original "Negative Reversal LUT.png" file.
* Convert the resulting PNG file into a .cube 3D LUT in https://sirserch.github.io/lut-creator-js/.
* Open the negative tiff in the camera raw dialogue. Switch off HDR if selected by default.
  * ALT/OPTION click Create new preset.
  * Select the recently created LUT cube "lutCreatorJs.cube", space Rec. 2020, Min:100%; Amount:100%; Max:100%.
  * Save preset.
* This preset can be loaded on top of any TIFF file of the same scene/roll.
* To apply this preset to RAW files of the same scene/roll.
  * Make sure the raw file is developed with the same settings as the file used to extract the LUT.
  * Load the 🜃 Adobe Standard to Linear preset.
  * Load the recently created profile with the negative reversal LUT.

<img width="536" alt="Create  XMP profile" src="https://github.com/user-attachments/assets/45d878ef-f2d6-49a1-a1c7-6d12917f3d7c">

Notes
*  The default working RGB color space in Photoshop is sRGB. Color may be slightly altered as the conversion from 32 to 16 bit at certain steps of the process defaults the color space to sRGB, regardless of the original color space of the image. It's recommended that you change the working RGB to REC.2020 in color settings for an accurate LUT extraction.
* When applying the neg>pos profile in raw images, note that every develop panel adjustment happens before the neg>pos LUT. You will see irreconcilable color distortion if changes are made on the develop panel. Contrast and brightness adjustments can be made with curves, inside a Luminance Range mask that covers the whole luminance range. These curves will affect the image after the neg>pos conversion.
