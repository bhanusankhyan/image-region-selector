import React from 'react';
import './App.css';
import RegionSelect from 'react-region-select';
import objectAssign from 'object-assign';
import './bootstrap.min.css'


class App extends React.Component{
   constructor(props){
     super(props);
   this.state = {
     image : null,
     regions : [],
     view : 'uncroped',
     button : false,
     image_name : 'Select File ...'

   }
   this.image_processing = this.image_processing.bind(this);
   this.regionRenderer = this.regionRenderer.bind(this);
   this.onChange = this.onChange.bind(this);
   this.view = this.view.bind(this)

   }
   image_processing(event){
   this.setState({
     image : URL.createObjectURL(event.target.files[0]),
     image_name : event.target.files[0].name
   })
   if((event.target.files[0].type.search('image')) < 0){
     alert("Please upload Image File")
   }
   }

   onChange(regions){
     this.setState({
     regions : regions,
     button : true
   })
   this.refs.exampleInputFile.setAttribute('disabled', true)
   }
   changeRegionData (index, event) {
   const region = this.state.regions[index];
   let color;
   switch (event.target.value) {
   case '1':
     color = 'rgba(0, 255, 0, 0.1)';
     break;
   case '2':
     color = 'rgba(0, 0, 255, 0.1)';
     break;
   case '3':
     color = 'rgba(255, 0, 0, 0.1)';
     break;
   default:
     color = 'rgba(0, 0, 0, 0.5)';
   }

   region.data.regionStyle = {
     background: color
   };
   this.onChange([
     ...this.state.regions.slice(0, index),
     objectAssign({}, region, {
       data: objectAssign({}, region.data, { dataType: event.target.value })
     }),
     ...this.state.regions.slice(index + 1)
   ]);
 }

 view(){
   this.setState({
     view : 'croped'
   })
 }



 regionRenderer (regionProps) {
 if (!regionProps.isChanging) {
   return (
     <div style={{ position: 'absolute', right: 0, bottom: '-1.5em' }}>
       <select onChange={(event) => this.changeRegionData(regionProps.index, event)} value={regionProps.data.dataType}>
         <option value='0'> Select Region </option>
         <option value='1'>Region 1</option>
         <option value='2'>Region 2</option>
         <option value='3'>Region 3</option>
       </select>
     </div>
   );
 }
}
getCroppedImg(imgObj, newWidth, newHeight, startX, startY, ratio) {
    var img = new Image();
    img.src = this.state.selectedImageURL;
    var tnCanvas = document.createElement('canvas')

    tnCanvas.width = newWidth;
    tnCanvas.height = newHeight;
    tnCanvas.getContext('2d').drawImage(img, startX, startY, newWidth, newHeight);
    return tnCanvas.toDataURL();
}
crop(data, index){
  var img = new Image()
  var cropped_image = new Image()
  img.src = this.state.image
    var crop_canvas,
      left = Math.round((data.x*img.width)/100),
      top =  Math.round((data.y*img.height)/100),
      width = Math.round((data.width*img.width)/100),
      height = Math.round((data.height*img.height)/100);

    crop_canvas = document.createElement('canvas');
    var line_break = document.createElement('div')
    line_break.style.cssText = 'height:50px;'
    crop_canvas.width = width
    crop_canvas.height = height
    crop_canvas.getContext('2d').drawImage(img, left,top,width,height,0,0,width,height);
    cropped_image.src = crop_canvas.toDataURL("image/png")
    this.refs.canvas.appendChild(cropped_image);
    this.refs.canvas.appendChild(line_break);
}

   render(){
     return(
       <div className="container">
       <div style={{height:'100px'}} />
       {this.state.view === 'uncroped' &&   <div className= "row">
       <div className="col-lg-1" />
       <div className="col-lg-4 col-sm-12">
       <div className="custom-file" id="customFile" lang="es">
        <input className="custom-file-input" id="exampleInputFile" ref="exampleInputFile" aria-describedby="fileHelp" onChange={this.image_processing} type="file" />
        <label className="custom-file-label" htmlFor="exampleInputFile">
           {this.state.image_name}
        </label>
</div>
       </div>
       <div className="col-lg-1" />
       <div className="col-lg-6 col-sm-12">
             <RegionSelect
               maxRegions={3}
               regions={this.state.regions}
               onChange={this.onChange}
               regionRenderer={this.regionRenderer}>
               <img alt='' src={this.state.image} width='700px'/>
              </RegionSelect>
              </div>
              {this.state.button && <button className="btn btn-secondary" onClick={this.view}>Process Image</button>}

         </div>}
         {
           this.state.view === 'croped' && this.state.regions.map((data,index) => {
               return(<div className="text-center" key = {index}> {this.crop(data, index)} </div>)

           })
         }
         <div className="text-center" id='canvas' ref='canvas'> {this.state.view === 'croped' && <h2>Selected Regions: </h2>}  <br/></div>
         </div>


     )
   }
 }


export default App;
