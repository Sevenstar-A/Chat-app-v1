import { create } from "zustand";
import { useUserStore } from "./userStore";


export const useChatStore = create((set) => ({
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,
    
    changeChat: (chatId, user) => {
        console.log("change chat clicked : ",chatId)
        const currentUser = useUserStore.getState().currentUser
        // check if current user is blocked by receiver, then don't show receiver's info
        if (user.blocked.includes(currentUser.id)) {
            return set({
                chatId:chatId,
                user: null,
                isCurrentUserBlocked: true,
                isReceiverBlocked: false,
            })
        }

        // check if receiver is blocked by current user
        else if (currentUser.blocked.includes(user.id)) {
            return set({
                chatId,
                user: user,
                isCurrentUserBlocked: false,
                isReceiverBlocked: true,
            })
        }
        else{
            return set({
                chatId:chatId,
                user: user,
                isCurrentUserBlocked: false,
                isReceiverBlocked: false,
            })

        }

    },

    changeBlocked: (user) => {
        // negate the current state of isReceiverBlocked 
        return set(prevState => ({ ...prevState, isReceiverBlocked: !prevState.isReceiverBlocked }))

    }

}))

