(self.webpackChunkonyx_app=self.webpackChunkonyx_app||[]).push([[198],{"./node_modules/@storybook/nextjs/dist sync recursive":module=>{function webpackEmptyContext(req){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}webpackEmptyContext.keys=()=>[],webpackEmptyContext.resolve=webpackEmptyContext,webpackEmptyContext.id="./node_modules/@storybook/nextjs/dist sync recursive",module.exports=webpackEmptyContext},"./stories/basics/OnyxImage.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Onyx_Image:()=>Onyx_Image,default:()=>OnyxImage_stories});var defineProperty=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/defineProperty.js"),react=__webpack_require__("./node_modules/next/dist/compiled/react/index.js"),Box=__webpack_require__("./node_modules/@mui/material/Box/Box.js"),next_image=__webpack_require__("./node_modules/@storybook/nextjs/dist/images/next-image.mjs"),__jsx=react.createElement;function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){(0,defineProperty.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}var OnyxImage=function OnyxImage(props){var validStyles={position:props.position||"relative",margin:props.margin||"",height:props.height||"100%",width:props.width||"100%",display:"flex",justifyContent:"center"===props.align?"center":"left"===props.align?"flex-start":"right"===props.align?"flex-end":"center",alignItems:"center"===props.align?"center":"left"===props.align?"flex-start":"right"===props.align?"flex-end":"center",minWidth:"50px",minHeight:"50px"};return __jsx(Box.Z,{sx:_objectSpread(_objectSpread({},validStyles),props.sx)},__jsx(next_image.Z,{src:props.src,unoptimized:props.unoptimized,alt:props.alt,fill:!0,style:{objectFit:"contain"}}))};OnyxImage.displayName="OnyxImage",OnyxImage.__docgenInfo={description:"@IUnknown404I Corporate Image stylizated component.\r\n@param props as wrapper styles and image src and alt attributes.\r\n@returns Next Image component wrapped by MUI Box.",methods:[],displayName:"OnyxImage",props:{src:{required:!0,tsType:{name:"string"},description:""},alt:{required:!0,tsType:{name:"string"},description:""},position:{required:!1,tsType:{name:"union",raw:"'absolute' | 'fixed' | 'relative' | 'static' | 'sticky'",elements:[{name:"literal",value:"'absolute'"},{name:"literal",value:"'fixed'"},{name:"literal",value:"'relative'"},{name:"literal",value:"'static'"},{name:"literal",value:"'sticky'"}]},description:""},margin:{required:!1,tsType:{name:"string"},description:""},width:{required:!1,tsType:{name:"string"},description:""},height:{required:!1,tsType:{name:"string"},description:""},align:{required:!1,tsType:{name:"union",raw:"'left' | 'center' | 'right'",elements:[{name:"literal",value:"'left'"},{name:"literal",value:"'center'"},{name:"literal",value:"'right'"}]},description:""},unoptimized:{required:!1,tsType:{name:"boolean"},description:""},sx:{required:!1,tsType:{name:"SxProps"},description:""}}};const basics_OnyxImage=OnyxImage;try{OnyxImage.displayName="OnyxImage",OnyxImage.__docgenInfo={description:"",displayName:"OnyxImage",props:{src:{defaultValue:null,description:"",name:"src",required:!0,type:{name:"string"}},alt:{defaultValue:null,description:"",name:"alt",required:!0,type:{name:"string"}},position:{defaultValue:null,description:"",name:"position",required:!1,type:{name:"enum",value:[{value:'"absolute"'},{value:'"fixed"'},{value:'"relative"'},{value:'"static"'},{value:'"sticky"'}]}},margin:{defaultValue:null,description:"",name:"margin",required:!1,type:{name:"string"}},width:{defaultValue:null,description:"",name:"width",required:!1,type:{name:"string"}},height:{defaultValue:null,description:"",name:"height",required:!1,type:{name:"string"}},align:{defaultValue:null,description:"",name:"align",required:!1,type:{name:"enum",value:[{value:'"left"'},{value:'"right"'},{value:'"center"'}]}},unoptimized:{defaultValue:null,description:"",name:"unoptimized",required:!1,type:{name:"boolean"}},sx:{defaultValue:null,description:"",name:"sx",required:!1,type:{name:"SxProps"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["components/basics/OnyxImage.tsx#OnyxImage"]={docgenInfo:OnyxImage.__docgenInfo,name:"OnyxImage",path:"components/basics/OnyxImage.tsx#OnyxImage"})}catch(__react_docgen_typescript_loader_error){}var _Onyx_Image$parameter,_Onyx_Image$parameter2;function OnyxImage_stories_ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function OnyxImage_stories_objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?OnyxImage_stories_ownKeys(Object(t),!0).forEach((function(r){(0,defineProperty.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):OnyxImage_stories_ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}const OnyxImage_stories={title:"Basics/Image",component:basics_OnyxImage,tags:["autodocs"]};var Onyx_Image={args:{src:"/offline.png",alt:"Onyx Imge alt text",position:"absolute",sx:{inset:"0 0"},unoptimized:!0}};Onyx_Image.parameters=OnyxImage_stories_objectSpread(OnyxImage_stories_objectSpread({},Onyx_Image.parameters),{},{docs:OnyxImage_stories_objectSpread(OnyxImage_stories_objectSpread({},null===(_Onyx_Image$parameter=Onyx_Image.parameters)||void 0===_Onyx_Image$parameter?void 0:_Onyx_Image$parameter.docs),{},{source:OnyxImage_stories_objectSpread({originalSource:"{\n  args: {\n    src: '/offline.png',\n    alt: 'Onyx Imge alt text',\n    position: 'absolute',\n    sx: {\n      inset: '0 0'\n    },\n    unoptimized: true\n  }\n}"},null===(_Onyx_Image$parameter2=Onyx_Image.parameters)||void 0===_Onyx_Image$parameter2||null===(_Onyx_Image$parameter2=_Onyx_Image$parameter2.docs)||void 0===_Onyx_Image$parameter2?void 0:_Onyx_Image$parameter2.source)})})}}]);