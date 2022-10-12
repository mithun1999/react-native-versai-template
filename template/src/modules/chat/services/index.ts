import {IUserDataAtom} from '@/atoms/userData.atom';
import {ChatNativeService} from './chat.service';

export type NativeChatInstance = ChatNativeService | null;

export class VersaiNativeChatSdk {
  private static instance: NativeChatInstance | null;

  static getInstance() {
    // if (!VersaiChatSdk.instance) throw new Error('Chat SDK is not initialized')
    if (!VersaiNativeChatSdk.instance) return null;
    return VersaiNativeChatSdk.instance;
  }

  static initialize(user: IUserDataAtom, cb?: () => void) {
    if (!VersaiNativeChatSdk.instance)
      VersaiNativeChatSdk.instance = new ChatNativeService(user);
    cb?.();
  }

  static destroyInstance() {
    VersaiNativeChatSdk.instance = null;
  }
}

export default VersaiNativeChatSdk;
