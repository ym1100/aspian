import { IPostsEnvelope } from '../../../../models/aspian-core/post';
import {
  PostAction,
  PostActionTypesEnum,
} from '../../../actions/aspian-core/post/types';
 
export interface IPostState {
  readonly postsEnvelope: IPostsEnvelope;
  readonly loadingInitial: boolean;
}

const initialState: IPostState = {
  postsEnvelope: {posts: [], postCount: 0},
  loadingInitial: true,
};

export const postReducer = (
  state: IPostState = initialState,
  action: PostAction
) => {
  switch (action.type) {
    case PostActionTypesEnum.GET_POSTS:
      return {
        postsEnvelope: action.payload,
        loadingInitial: false,
      };
    case PostActionTypesEnum.LOADING_POST:
      return { ...state, loadingInitial: action.payload };
    default:
      return state;
  }
};