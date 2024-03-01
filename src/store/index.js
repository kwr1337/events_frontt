import { createStore } from 'vuex'
import {feedbackModule} from "@/store/feedbackModule";

export default createStore({
    modules: {
        feedbacks: feedbackModule
    }
})