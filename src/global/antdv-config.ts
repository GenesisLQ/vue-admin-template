import Vue from 'vue';
import {
  Button,
  Checkbox,
  ConfigProvider,
  DatePicker,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  List,
  Menu,
  Modal,
  Pagination,
  Popover,
  Radio,
  Select,
  Spin,
  Table,
  Tag,
  Upload,
  TimePicker,
  message,
} from 'ant-design-vue';
import { VueConstructor } from 'vue/types/umd';

function install(Vue: VueConstructor) {
  Vue.use(Button);
  Vue.use(Checkbox);
  Vue.use(ConfigProvider);
  Vue.use(DatePicker);
  Vue.use(Dropdown);
  Vue.use(Form);
  Vue.use(Icon);
  Vue.use(Input);
  Vue.use(InputNumber);
  Vue.use(List);
  Vue.use(Menu);
  Vue.use(Modal);
  Vue.use(Pagination);
  Vue.use(Popover);
  Vue.use(Radio);
  Vue.use(Select);
  Vue.use(Spin);
  Vue.use(Table);
  Vue.use(Tag);
  Vue.use(Upload);
  Vue.use(TimePicker);
}
Vue.prototype.$message = message;

export default install;
