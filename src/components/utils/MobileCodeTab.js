import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './MobileCodeTab.css';

export default function MobileCodeTab ({currentEditor, setCurrentEditor, handleClick, faHtml, faCss, faJs, faCopy}) {

  const activeTab = (ev) => currentEditor === ev ? 'tab__btn tab__btn--active' : 'tab__btn'

  return (
      <div className='tab'>
        <div className='tab__tabs'>
          <button className={activeTab('html')} onClick={e => setCurrentEditor('html')}>
            <FontAwesomeIcon className="tab__i-html" icon={faHtml} />          
            HTML
          </button>
          <button  className={activeTab('css')} onClick={e => setCurrentEditor('css')}>
            <FontAwesomeIcon  className="tab__i-css"icon={faCss} />          
            CSS
          </button>
          <button  className={activeTab('js')} onClick={e => setCurrentEditor('js')}>
            <FontAwesomeIcon  className="tab__i-js"icon={faJs} />          
            JavaScript
          </button>
        </div>
        <button className='tab__copy' onClick={handleClick}>
          <FontAwesomeIcon icon={faCopy} />
        </button>
      </div>

  )

}
