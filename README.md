# se-shift-plot
Shift Plot for Safety Explorer

# How to set up for development
1. make sure Node is installed on your computer
2. clone this repo to a directory of your choice
3. from command line, run `npm install` at root of the project directory
4. source code for the chart is in the **src** directory; code for a React wrapper for using as a renderer in ChartFoundry is in the **cf-wrapper** directory
5. there are several build scripts:
  - to build the code for just the chart, run `npm run build`
  - to build the renderer for ChartFoundry, run `npm run build-renderer`
  - to continually test your changes reflected without having to run a script every time, run `npm run dev-watch`; this will bundle up the files in **src** and save them in **test/bundle.js**, which can be used in **test/index.html** to display an example chart
