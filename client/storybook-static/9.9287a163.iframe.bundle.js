"use strict";(self.webpackChunkonyx_app=self.webpackChunkonyx_app||[]).push([[9],{"./node_modules/@mui/material/Modal/Modal.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>Modal_Modal});var objectWithoutPropertiesLoose=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js"),esm_extends=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/extends.js"),react=__webpack_require__("./node_modules/next/dist/compiled/react/index.js"),clsx=__webpack_require__("./node_modules/clsx/dist/clsx.mjs"),useSlotProps=__webpack_require__("./node_modules/@mui/base/utils/useSlotProps.js"),useForkRef=__webpack_require__("./node_modules/@mui/utils/esm/useForkRef/useForkRef.js"),ownerDocument=__webpack_require__("./node_modules/@mui/utils/esm/ownerDocument/ownerDocument.js"),useEventCallback=__webpack_require__("./node_modules/@mui/utils/esm/useEventCallback/useEventCallback.js"),createChainedFunction=__webpack_require__("./node_modules/@mui/utils/esm/createChainedFunction.js"),extractEventHandlers=__webpack_require__("./node_modules/@mui/base/utils/extractEventHandlers.js"),ownerWindow=__webpack_require__("./node_modules/@mui/utils/esm/ownerWindow/ownerWindow.js"),getScrollbarSize=__webpack_require__("./node_modules/@mui/utils/esm/getScrollbarSize.js");function ariaHidden(element,show){show?element.setAttribute("aria-hidden","true"):element.removeAttribute("aria-hidden")}function getPaddingRight(element){return parseInt((0,ownerWindow.Z)(element).getComputedStyle(element).paddingRight,10)||0}function ariaHiddenSiblings(container,mountElement,currentElement,elementsToExclude,show){const blacklist=[mountElement,currentElement,...elementsToExclude];[].forEach.call(container.children,(element=>{const isNotExcludedElement=-1===blacklist.indexOf(element),isNotForbiddenElement=!function isAriaHiddenForbiddenOnElement(element){const isForbiddenTagName=-1!==["TEMPLATE","SCRIPT","STYLE","LINK","MAP","META","NOSCRIPT","PICTURE","COL","COLGROUP","PARAM","SLOT","SOURCE","TRACK"].indexOf(element.tagName),isInputHidden="INPUT"===element.tagName&&"hidden"===element.getAttribute("type");return isForbiddenTagName||isInputHidden}(element);isNotExcludedElement&&isNotForbiddenElement&&ariaHidden(element,show)}))}function findIndexOf(items,callback){let idx=-1;return items.some(((item,index)=>!!callback(item)&&(idx=index,!0))),idx}function handleContainer(containerInfo,props){const restoreStyle=[],container=containerInfo.container;if(!props.disableScrollLock){if(function isOverflowing(container){const doc=(0,ownerDocument.Z)(container);return doc.body===container?(0,ownerWindow.Z)(container).innerWidth>doc.documentElement.clientWidth:container.scrollHeight>container.clientHeight}(container)){const scrollbarSize=(0,getScrollbarSize.Z)((0,ownerDocument.Z)(container));restoreStyle.push({value:container.style.paddingRight,property:"padding-right",el:container}),container.style.paddingRight=`${getPaddingRight(container)+scrollbarSize}px`;const fixedElements=(0,ownerDocument.Z)(container).querySelectorAll(".mui-fixed");[].forEach.call(fixedElements,(element=>{restoreStyle.push({value:element.style.paddingRight,property:"padding-right",el:element}),element.style.paddingRight=`${getPaddingRight(element)+scrollbarSize}px`}))}let scrollContainer;if(container.parentNode instanceof DocumentFragment)scrollContainer=(0,ownerDocument.Z)(container).body;else{const parent=container.parentElement,containerWindow=(0,ownerWindow.Z)(container);scrollContainer="HTML"===(null==parent?void 0:parent.nodeName)&&"scroll"===containerWindow.getComputedStyle(parent).overflowY?parent:container}restoreStyle.push({value:scrollContainer.style.overflow,property:"overflow",el:scrollContainer},{value:scrollContainer.style.overflowX,property:"overflow-x",el:scrollContainer},{value:scrollContainer.style.overflowY,property:"overflow-y",el:scrollContainer}),scrollContainer.style.overflow="hidden"}return()=>{restoreStyle.forEach((({value,el,property})=>{value?el.style.setProperty(property,value):el.style.removeProperty(property)}))}}const defaultManager=new class ModalManager{constructor(){this.containers=void 0,this.modals=void 0,this.modals=[],this.containers=[]}add(modal,container){let modalIndex=this.modals.indexOf(modal);if(-1!==modalIndex)return modalIndex;modalIndex=this.modals.length,this.modals.push(modal),modal.modalRef&&ariaHidden(modal.modalRef,!1);const hiddenSiblings=function getHiddenSiblings(container){const hiddenSiblings=[];return[].forEach.call(container.children,(element=>{"true"===element.getAttribute("aria-hidden")&&hiddenSiblings.push(element)})),hiddenSiblings}(container);ariaHiddenSiblings(container,modal.mount,modal.modalRef,hiddenSiblings,!0);const containerIndex=findIndexOf(this.containers,(item=>item.container===container));return-1!==containerIndex?(this.containers[containerIndex].modals.push(modal),modalIndex):(this.containers.push({modals:[modal],container,restore:null,hiddenSiblings}),modalIndex)}mount(modal,props){const containerIndex=findIndexOf(this.containers,(item=>-1!==item.modals.indexOf(modal))),containerInfo=this.containers[containerIndex];containerInfo.restore||(containerInfo.restore=handleContainer(containerInfo,props))}remove(modal,ariaHiddenState=!0){const modalIndex=this.modals.indexOf(modal);if(-1===modalIndex)return modalIndex;const containerIndex=findIndexOf(this.containers,(item=>-1!==item.modals.indexOf(modal))),containerInfo=this.containers[containerIndex];if(containerInfo.modals.splice(containerInfo.modals.indexOf(modal),1),this.modals.splice(modalIndex,1),0===containerInfo.modals.length)containerInfo.restore&&containerInfo.restore(),modal.modalRef&&ariaHidden(modal.modalRef,ariaHiddenState),ariaHiddenSiblings(containerInfo.container,modal.mount,modal.modalRef,containerInfo.hiddenSiblings,!1),this.containers.splice(containerIndex,1);else{const nextTop=containerInfo.modals[containerInfo.modals.length-1];nextTop.modalRef&&ariaHidden(nextTop.modalRef,!1)}return modalIndex}isTopModal(modal){return this.modals.length>0&&this.modals[this.modals.length-1]===modal}};function useModal(parameters){const{container,disableEscapeKeyDown=!1,disableScrollLock=!1,manager=defaultManager,closeAfterTransition=!1,onTransitionEnter,onTransitionExited,children,onClose,open,rootRef}=parameters,modal=react.useRef({}),mountNodeRef=react.useRef(null),modalRef=react.useRef(null),handleRef=(0,useForkRef.Z)(modalRef,rootRef),[exited,setExited]=react.useState(!open),hasTransition=function getHasTransition(children){return!!children&&children.props.hasOwnProperty("in")}(children);let ariaHiddenProp=!0;"false"!==parameters["aria-hidden"]&&!1!==parameters["aria-hidden"]||(ariaHiddenProp=!1);const getModal=()=>(modal.current.modalRef=modalRef.current,modal.current.mount=mountNodeRef.current,modal.current),handleMounted=()=>{manager.mount(getModal(),{disableScrollLock}),modalRef.current&&(modalRef.current.scrollTop=0)},handleOpen=(0,useEventCallback.Z)((()=>{const resolvedContainer=function getContainer(container){return"function"==typeof container?container():container}(container)||(0,ownerDocument.Z)(mountNodeRef.current).body;manager.add(getModal(),resolvedContainer),modalRef.current&&handleMounted()})),isTopModal=react.useCallback((()=>manager.isTopModal(getModal())),[manager]),handlePortalRef=(0,useEventCallback.Z)((node=>{mountNodeRef.current=node,node&&(open&&isTopModal()?handleMounted():modalRef.current&&ariaHidden(modalRef.current,ariaHiddenProp))})),handleClose=react.useCallback((()=>{manager.remove(getModal(),ariaHiddenProp)}),[ariaHiddenProp,manager]);react.useEffect((()=>()=>{handleClose()}),[handleClose]),react.useEffect((()=>{open?handleOpen():hasTransition&&closeAfterTransition||handleClose()}),[open,handleClose,hasTransition,closeAfterTransition,handleOpen]);const createHandleKeyDown=otherHandlers=>event=>{var _otherHandlers$onKeyD;null==(_otherHandlers$onKeyD=otherHandlers.onKeyDown)||_otherHandlers$onKeyD.call(otherHandlers,event),"Escape"===event.key&&isTopModal()&&(disableEscapeKeyDown||(event.stopPropagation(),onClose&&onClose(event,"escapeKeyDown")))},createHandleBackdropClick=otherHandlers=>event=>{var _otherHandlers$onClic;null==(_otherHandlers$onClic=otherHandlers.onClick)||_otherHandlers$onClic.call(otherHandlers,event),event.target===event.currentTarget&&onClose&&onClose(event,"backdropClick")};return{getRootProps:(otherHandlers={})=>{const propsEventHandlers=(0,extractEventHandlers._)(parameters);delete propsEventHandlers.onTransitionEnter,delete propsEventHandlers.onTransitionExited;const externalEventHandlers=(0,esm_extends.Z)({},propsEventHandlers,otherHandlers);return(0,esm_extends.Z)({role:"presentation"},externalEventHandlers,{onKeyDown:createHandleKeyDown(externalEventHandlers),ref:handleRef})},getBackdropProps:(otherHandlers={})=>{const externalEventHandlers=otherHandlers;return(0,esm_extends.Z)({"aria-hidden":!0},externalEventHandlers,{onClick:createHandleBackdropClick(externalEventHandlers),open})},getTransitionProps:()=>({onEnter:(0,createChainedFunction.Z)((()=>{setExited(!1),onTransitionEnter&&onTransitionEnter()}),null==children?void 0:children.props.onEnter),onExited:(0,createChainedFunction.Z)((()=>{setExited(!0),onTransitionExited&&onTransitionExited(),closeAfterTransition&&handleClose()}),null==children?void 0:children.props.onExited)}),rootRef:handleRef,portalRef:handlePortalRef,isTopModal,exited,hasTransition}}var composeClasses=__webpack_require__("./node_modules/@mui/utils/esm/composeClasses/composeClasses.js"),jsx_runtime=__webpack_require__("./node_modules/next/dist/compiled/react/jsx-runtime.js");const candidatesSelector=["input","select","textarea","a[href]","button","[tabindex]","audio[controls]","video[controls]",'[contenteditable]:not([contenteditable="false"])'].join(",");function defaultGetTabbable(root){const regularTabNodes=[],orderedTabNodes=[];return Array.from(root.querySelectorAll(candidatesSelector)).forEach(((node,i)=>{const nodeTabIndex=function getTabIndex(node){const tabindexAttr=parseInt(node.getAttribute("tabindex")||"",10);return Number.isNaN(tabindexAttr)?"true"===node.contentEditable||("AUDIO"===node.nodeName||"VIDEO"===node.nodeName||"DETAILS"===node.nodeName)&&null===node.getAttribute("tabindex")?0:node.tabIndex:tabindexAttr}(node);-1!==nodeTabIndex&&function isNodeMatchingSelectorFocusable(node){return!(node.disabled||"INPUT"===node.tagName&&"hidden"===node.type||function isNonTabbableRadio(node){if("INPUT"!==node.tagName||"radio"!==node.type)return!1;if(!node.name)return!1;const getRadio=selector=>node.ownerDocument.querySelector(`input[type="radio"]${selector}`);let roving=getRadio(`[name="${node.name}"]:checked`);return roving||(roving=getRadio(`[name="${node.name}"]`)),roving!==node}(node))}(node)&&(0===nodeTabIndex?regularTabNodes.push(node):orderedTabNodes.push({documentOrder:i,tabIndex:nodeTabIndex,node}))})),orderedTabNodes.sort(((a,b)=>a.tabIndex===b.tabIndex?a.documentOrder-b.documentOrder:a.tabIndex-b.tabIndex)).map((a=>a.node)).concat(regularTabNodes)}function defaultIsEnabled(){return!0}function FocusTrap(props){const{children,disableAutoFocus=!1,disableEnforceFocus=!1,disableRestoreFocus=!1,getTabbable=defaultGetTabbable,isEnabled=defaultIsEnabled,open}=props,ignoreNextEnforceFocus=react.useRef(!1),sentinelStart=react.useRef(null),sentinelEnd=react.useRef(null),nodeToRestore=react.useRef(null),reactFocusEventTarget=react.useRef(null),activated=react.useRef(!1),rootRef=react.useRef(null),handleRef=(0,useForkRef.Z)(children.ref,rootRef),lastKeydown=react.useRef(null);react.useEffect((()=>{open&&rootRef.current&&(activated.current=!disableAutoFocus)}),[disableAutoFocus,open]),react.useEffect((()=>{if(!open||!rootRef.current)return;const doc=(0,ownerDocument.Z)(rootRef.current);return rootRef.current.contains(doc.activeElement)||(rootRef.current.hasAttribute("tabIndex")||rootRef.current.setAttribute("tabIndex","-1"),activated.current&&rootRef.current.focus()),()=>{disableRestoreFocus||(nodeToRestore.current&&nodeToRestore.current.focus&&(ignoreNextEnforceFocus.current=!0,nodeToRestore.current.focus()),nodeToRestore.current=null)}}),[open]),react.useEffect((()=>{if(!open||!rootRef.current)return;const doc=(0,ownerDocument.Z)(rootRef.current),loopFocus=nativeEvent=>{lastKeydown.current=nativeEvent,!disableEnforceFocus&&isEnabled()&&"Tab"===nativeEvent.key&&doc.activeElement===rootRef.current&&nativeEvent.shiftKey&&(ignoreNextEnforceFocus.current=!0,sentinelEnd.current&&sentinelEnd.current.focus())},contain=()=>{const rootElement=rootRef.current;if(null===rootElement)return;if(!doc.hasFocus()||!isEnabled()||ignoreNextEnforceFocus.current)return void(ignoreNextEnforceFocus.current=!1);if(rootElement.contains(doc.activeElement))return;if(disableEnforceFocus&&doc.activeElement!==sentinelStart.current&&doc.activeElement!==sentinelEnd.current)return;if(doc.activeElement!==reactFocusEventTarget.current)reactFocusEventTarget.current=null;else if(null!==reactFocusEventTarget.current)return;if(!activated.current)return;let tabbable=[];if(doc.activeElement!==sentinelStart.current&&doc.activeElement!==sentinelEnd.current||(tabbable=getTabbable(rootRef.current)),tabbable.length>0){var _lastKeydown$current,_lastKeydown$current2;const isShiftTab=Boolean((null==(_lastKeydown$current=lastKeydown.current)?void 0:_lastKeydown$current.shiftKey)&&"Tab"===(null==(_lastKeydown$current2=lastKeydown.current)?void 0:_lastKeydown$current2.key)),focusNext=tabbable[0],focusPrevious=tabbable[tabbable.length-1];"string"!=typeof focusNext&&"string"!=typeof focusPrevious&&(isShiftTab?focusPrevious.focus():focusNext.focus())}else rootElement.focus()};doc.addEventListener("focusin",contain),doc.addEventListener("keydown",loopFocus,!0);const interval=setInterval((()=>{doc.activeElement&&"BODY"===doc.activeElement.tagName&&contain()}),50);return()=>{clearInterval(interval),doc.removeEventListener("focusin",contain),doc.removeEventListener("keydown",loopFocus,!0)}}),[disableAutoFocus,disableEnforceFocus,disableRestoreFocus,isEnabled,open,getTabbable]);const handleFocusSentinel=event=>{null===nodeToRestore.current&&(nodeToRestore.current=event.relatedTarget),activated.current=!0};return(0,jsx_runtime.jsxs)(react.Fragment,{children:[(0,jsx_runtime.jsx)("div",{tabIndex:open?0:-1,onFocus:handleFocusSentinel,ref:sentinelStart,"data-testid":"sentinelStart"}),react.cloneElement(children,{ref:handleRef,onFocus:event=>{null===nodeToRestore.current&&(nodeToRestore.current=event.relatedTarget),activated.current=!0,reactFocusEventTarget.current=event.target;const childrenPropsHandler=children.props.onFocus;childrenPropsHandler&&childrenPropsHandler(event)}}),(0,jsx_runtime.jsx)("div",{tabIndex:open?0:-1,onFocus:handleFocusSentinel,ref:sentinelEnd,"data-testid":"sentinelEnd"})]})}var Portal=__webpack_require__("./node_modules/@mui/base/Portal/Portal.js"),styled=__webpack_require__("./node_modules/@mui/material/styles/styled.js"),useThemeProps=__webpack_require__("./node_modules/@mui/material/styles/useThemeProps.js"),Backdrop=__webpack_require__("./node_modules/@mui/material/Backdrop/Backdrop.js"),generateUtilityClasses=__webpack_require__("./node_modules/@mui/utils/esm/generateUtilityClasses/generateUtilityClasses.js"),generateUtilityClass=__webpack_require__("./node_modules/@mui/utils/esm/generateUtilityClass/generateUtilityClass.js");function getModalUtilityClass(slot){return(0,generateUtilityClass.Z)("MuiModal",slot)}(0,generateUtilityClasses.Z)("MuiModal",["root","hidden","backdrop"]);const _excluded=["BackdropComponent","BackdropProps","classes","className","closeAfterTransition","children","container","component","components","componentsProps","disableAutoFocus","disableEnforceFocus","disableEscapeKeyDown","disablePortal","disableRestoreFocus","disableScrollLock","hideBackdrop","keepMounted","onBackdropClick","onClose","onTransitionEnter","onTransitionExited","open","slotProps","slots","theme"],ModalRoot=(0,styled.ZP)("div",{name:"MuiModal",slot:"Root",overridesResolver:(props,styles)=>{const{ownerState}=props;return[styles.root,!ownerState.open&&ownerState.exited&&styles.hidden]}})((({theme,ownerState})=>(0,esm_extends.Z)({position:"fixed",zIndex:(theme.vars||theme).zIndex.modal,right:0,bottom:0,top:0,left:0},!ownerState.open&&ownerState.exited&&{visibility:"hidden"}))),ModalBackdrop=(0,styled.ZP)(Backdrop.Z,{name:"MuiModal",slot:"Backdrop",overridesResolver:(props,styles)=>styles.backdrop})({zIndex:-1}),Modal_Modal=react.forwardRef((function Modal(inProps,ref){var _ref,_slots$root,_ref2,_slots$backdrop,_slotProps$root,_slotProps$backdrop;const props=(0,useThemeProps.Z)({name:"MuiModal",props:inProps}),{BackdropComponent=ModalBackdrop,BackdropProps,className,closeAfterTransition=!1,children,container,component,components={},componentsProps={},disableAutoFocus=!1,disableEnforceFocus=!1,disableEscapeKeyDown=!1,disablePortal=!1,disableRestoreFocus=!1,disableScrollLock=!1,hideBackdrop=!1,keepMounted=!1,onBackdropClick,open,slotProps,slots}=props,other=(0,objectWithoutPropertiesLoose.Z)(props,_excluded),propsWithDefaults=(0,esm_extends.Z)({},props,{closeAfterTransition,disableAutoFocus,disableEnforceFocus,disableEscapeKeyDown,disablePortal,disableRestoreFocus,disableScrollLock,hideBackdrop,keepMounted}),{getRootProps,getBackdropProps,getTransitionProps,portalRef,isTopModal,exited,hasTransition}=useModal((0,esm_extends.Z)({},propsWithDefaults,{rootRef:ref})),ownerState=(0,esm_extends.Z)({},propsWithDefaults,{exited}),classes=(ownerState=>{const{open,exited,classes}=ownerState,slots={root:["root",!open&&exited&&"hidden"],backdrop:["backdrop"]};return(0,composeClasses.Z)(slots,getModalUtilityClass,classes)})(ownerState),childProps={};if(void 0===children.props.tabIndex&&(childProps.tabIndex="-1"),hasTransition){const{onEnter,onExited}=getTransitionProps();childProps.onEnter=onEnter,childProps.onExited=onExited}const RootSlot=null!=(_ref=null!=(_slots$root=null==slots?void 0:slots.root)?_slots$root:components.Root)?_ref:ModalRoot,BackdropSlot=null!=(_ref2=null!=(_slots$backdrop=null==slots?void 0:slots.backdrop)?_slots$backdrop:components.Backdrop)?_ref2:BackdropComponent,rootSlotProps=null!=(_slotProps$root=null==slotProps?void 0:slotProps.root)?_slotProps$root:componentsProps.root,backdropSlotProps=null!=(_slotProps$backdrop=null==slotProps?void 0:slotProps.backdrop)?_slotProps$backdrop:componentsProps.backdrop,rootProps=(0,useSlotProps.y)({elementType:RootSlot,externalSlotProps:rootSlotProps,externalForwardedProps:other,getSlotProps:getRootProps,additionalProps:{ref,as:component},ownerState,className:(0,clsx.Z)(className,null==rootSlotProps?void 0:rootSlotProps.className,null==classes?void 0:classes.root,!ownerState.open&&ownerState.exited&&(null==classes?void 0:classes.hidden))}),backdropProps=(0,useSlotProps.y)({elementType:BackdropSlot,externalSlotProps:backdropSlotProps,additionalProps:BackdropProps,getSlotProps:otherHandlers=>getBackdropProps((0,esm_extends.Z)({},otherHandlers,{onClick:e=>{onBackdropClick&&onBackdropClick(e),null!=otherHandlers&&otherHandlers.onClick&&otherHandlers.onClick(e)}})),className:(0,clsx.Z)(null==backdropSlotProps?void 0:backdropSlotProps.className,null==BackdropProps?void 0:BackdropProps.className,null==classes?void 0:classes.backdrop),ownerState});return keepMounted||open||hasTransition&&!exited?(0,jsx_runtime.jsx)(Portal.h,{ref:portalRef,container,disablePortal,children:(0,jsx_runtime.jsxs)(RootSlot,(0,esm_extends.Z)({},rootProps,{children:[!hideBackdrop&&BackdropComponent?(0,jsx_runtime.jsx)(BackdropSlot,(0,esm_extends.Z)({},backdropProps)):null,(0,jsx_runtime.jsx)(FocusTrap,{disableEnforceFocus,disableAutoFocus,disableRestoreFocus,isEnabled:isTopModal,open,children:react.cloneElement(children,childProps)})]}))}):null}))},"./node_modules/@mui/utils/esm/getScrollbarSize.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function getScrollbarSize(doc){const documentWidth=doc.documentElement.clientWidth;return Math.abs(window.innerWidth-documentWidth)}__webpack_require__.d(__webpack_exports__,{Z:()=>getScrollbarSize})}}]);