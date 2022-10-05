import {SyncOutlined} from '@ant-design/icons';
import styles from "./spinner.module.scss"
const Spinner = () => {
    return (
        <div  className={styles.spinnerAlign} >
         <SyncOutlined style={{fontSize:'20px'}} spin />
        </div>
    )
}
export default Spinner;