import 
{
useQuery,
useMutation,
useQueryClient,
useInfiniteQuery,
} from '@tanstack/react-query'
import { createPost, createUserAccount, deleteSavedPost, getCurrentUser, getRecentPosts, likePost, savePost, signInAccount, signOutAccount } from '../appwrite/api'
import { INewPost, INewUser } from '@/types'
import { QUERY_KEYS } from './querykeys'
import { useUserContext } from '@/context/AuthContext'
import exp from 'constants'
import { string } from 'zod'

export const useCreateUserAccountMutation=()=>
{
    return useMutation({
        mutationFn:(user: INewUser)=> createUserAccount(user)
    })
}

export const useSignInAccountMutation=()=>
    {
        return useMutation({
            mutationFn:(user: {email: string;
                password: string; 
            })=> signInAccount(user),
        })
    }
 
export const useSignOutAccountMutation=()=>
        {
            return useMutation({
                mutationFn: signOutAccount,
            })
        }   
        
export const useCreatePost = () => {
            const queryClient = useQueryClient();
            const { user } = useUserContext(); // Get the current authenticated user
          
            return useMutation({
              mutationFn: (post: INewPost) => {
                const postWithAccountId = {
                  ...post,
                  accountId: user.accountId, // Add accountId to the post data
                };
                console.log("Post Data:", postWithAccountId);

                return createPost(postWithAccountId);
              },
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
                });
              },
              onError: (error) => {
                console.error('Error creating post:', error);
              },
            });
          };
    
export const useGetRecentPosts = () => {
            return useQuery({
              queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
              queryFn: getRecentPosts,
            });
          };    
 
          export const useLikePost = () => {
            const queryClient = useQueryClient();
        
            return useMutation({
                mutationFn: ({ postId, likesArray }: { postId: string; likesArray: string[] }) => likePost(postId, likesArray),
                onSuccess: (data) => {
                    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id] });
                    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] });
                    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS] });
                    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
                },
                onError: (error: any) => {
                    // You can display an error message here
                    console.error('Error liking post:', error);
                },
            });
        };
        
 
 export const useSavePost = ()=> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:({postId,userId}: {postId: string; userId: string }) => savePost(postId,userId),
    onSuccess:()=> {


      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })

    }
      
  })
 }
 
 export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
    
  });
};
 export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};