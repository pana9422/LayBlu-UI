import { useParams } from "react-router-dom";
import { useSearchFile } from "../../hooks/useFetch";
import { useState, useEffect } from 'react';

import { copyToClipboard } from '../helpers/copyToClipboard'

import { LIST_COMPONENTS } from "../../data/components";

import MobileCodeTab from '../utils/MobileCodeTab'
import EditorCode from "../utils/EditorCode";

import { faHtml5, faCss3, faJs } from "@fortawesome/free-brands-svg-icons";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

import "./Code.css";

document.addEventListener('keydown', e => {
  if(e.ctrlKey && e.key === 's') {
    e.preventDefault();
  }
})

const Code = () => {
    const { component } = useParams()
    const { code } = useParams()
    const { tags } = LIST_COMPONENTS.filter(({ path }) => path === code)[0]
    const { html, css, js, preview } = useSearchFile(`/components/${component.toLocaleLowerCase()}/${code}`, tags)
    const [isMobile, setIsMobile] = useState(false)
    const [currentEditor, setCurrentEditor] = useState('html')

   // Media query, for responsive code editor
   useEffect(() => {
      const mediaQuery = window.matchMedia('(max-width: 992px)');

      mediaQuery.matches ? setIsMobile(true) : setIsMobile(false);

      mediaQuery.addEventListener('change', () => {
        mediaQuery.matches ? setIsMobile(true) : setIsMobile(false);
      })
   },[])

    const getStyle = (element, prop) => window.getComputedStyle(element)[prop]

    const handlerResizer = (size, e) => {
        const controller = new AbortController()
        const { signal } = controller

        const $prevElement = e.target.previousElementSibling
        const $nextElement = e.target.nextElementSibling

        const sizePrevElement = parseFloat(getStyle($prevElement, size));
        const sizeNextElement = parseFloat(getStyle($nextElement, size));

        size === "width" && $nextElement.classList.add("code__preview-resize")
        document.addEventListener('mousemove', (event) => {

            const limitPrev = parseFloat(getStyle($prevElement, size))
            const limitNext = parseFloat(getStyle($nextElement, size))
            const axis = (ev, val) => val === "width" ? ev.clientX : ev.clientY
            const sizeResizerPrevElement = axis(event, size) - axis(e, size) + sizePrevElement
            const sizeResizerNextElement = axis(e, size) - axis(event, size) + sizeNextElement

            limitNext > 40 && $prevElement.style.setProperty(size, `${sizeResizerPrevElement}px`)
            limitPrev > 40 && $nextElement.style.setProperty(size, `${sizeResizerNextElement}px`)

        }, { signal })
        document.addEventListener('mouseup', () => {

            controller.abort()
            size === "width" && $nextElement.classList.remove("code__preview-resize")

        }, { signal })
    }

  // Handling the click on copy button
  const handleClick = () => {
   switch (currentEditor) {
      case 'html':
        copyToClipboard(html.contentHTML)
        break;

      case 'css':
        copyToClipboard(css.contentCSS)
        
        break;

      case 'js':
        copyToClipboard(js.contentJS)
        
        break;
      default:
       alert('Copied to clipboard')
        break;
    }
  }

    return (
        <div className="code">
            <div className="code__editor">
            {
              isMobile ? (
                <>
                <MobileCodeTab 
                  currentEditor={currentEditor}
                  setCurrentEditor={setCurrentEditor} 
                  faHtml={faHtml5} 
                  faCss={faCss3}
                  faJs={faJs}
                  faCopy={faCopy}
                  handleClick={handleClick}
                />
                {currentEditor === 'html' && (
                  <EditorCode 
                    content={html?.contentHTML} 
                    setContent={html?.setContentHTML} 
                    icon={faHtml5} 
                    lang="HTML" 
                    isMobile={isMobile}/>
                )}
                {currentEditor === 'css' && (
                  <EditorCode 
                    content={css?.contentCSS} 
                    setContent={css?.setContentCSS} 
                    icon={faCss3} 
                    lang="CSS" 
                    isMobile={isMobile}/>
                )}
                {currentEditor === 'js' && (
                  <EditorCode 
                    content={js?.contentJS} 
                    setContent={js?.setContentJS} 
                    icon={faJs} 
                    lang="JavaScript" 
                    isMobile={isMobile}/>
                )}
                </>
              ) : (
                <>
                <EditorCode content={html?.contentHTML} setContent={html?.setContentHTML} icon={faHtml5} lang="HTML" isMobile={isMobile}/>
                <div className="code__resizerH" onMouseDown={(e) => handlerResizer('height', e)}></div>
                <EditorCode content={css?.contentCSS} setContent={css?.setContentCSS} icon={faCss3} lang="CSS" isMobile={isMobile}/>
                <div className="code__resizerH" onMouseDown={(e) => handlerResizer('height', e)}></div>
                <EditorCode content={js?.contentJS} setContent={js?.setContentJS} icon={faJs} lang="JavaScript" isMobile={isMobile}/>
                </>
              )
            }
                
            </div>
            <div className="code__resizerV" onMouseDown={(e) => handlerResizer('width', e)}></div>
            <iframe className="code__preview" title={code} src={`data:text/html;base64,${preview}`} />
        </div>
    );
};

export default Code;
