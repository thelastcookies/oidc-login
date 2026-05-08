import Bowser from 'bowser';
import type { MessageInstance } from 'ant-design-vue/es/message/interface';
import type { ModalStaticFunctions } from 'ant-design-vue/es/modal/confirm';
import type { NotificationInstance } from 'ant-design-vue/es/notification/interface';

export const useAppStore = defineStore('app', () => {
  const windowInnerWidth = ref(0);
  const windowInnerHeight = ref(0);

  const userAgent = Bowser.getParser(window.navigator.userAgent);
  const deviceType = userAgent.getPlatformType();

  const message = ref({} as MessageInstance);
  const notification = ref({} as NotificationInstance);
  const modal = ref({} as Omit<ModalStaticFunctions, 'warn'>);
  (() => {
    const staticFunction = App.useApp();
    message.value = staticFunction.message;
    notification.value = staticFunction.notification;
    modal.value = staticFunction.modal;
  })();

  return {
    windowInnerWidth,
    windowInnerHeight,
    userAgent,
    deviceType,
    message, notification, modal,
  };
});
