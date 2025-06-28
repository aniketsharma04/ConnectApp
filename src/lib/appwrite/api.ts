import { ID, ImageGravity, Query } from 'appwrite';
import { INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from './config';

// Create a new user account
export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );

        if (!newAccount) throw new Error("Failed to create a new account.");

        const avatarUrl = avatars.getInitials(user.name);
        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        });

        return newUser;
    } catch (error) {
        console.error('Error creating user account:', error);
        throw new Error('Account creation failed.');
    }
}

// Save user details to the database
export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        );

        return newUser;
    } catch (error) {
        console.error('Error saving user to DB:', error);
        throw new Error('Failed to save user to database.');
    }
}

// Sign in a user account
export async function signInAccount(user: { email: string; password: string }) {
    try {
        const currentSession = await account.getSession('current').catch(() => null);

        if (currentSession) {
            await account.deleteSession('current');
        }

        const session = await account.createEmailPasswordSession(user.email, user.password);
        return session;
    } catch (error) {
        console.error('Error during sign-in:', error);
        throw new Error('Sign-in failed.');
    }
}

// Get current logged-in user details
export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw new Error('No account found.');

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser || currentUser.documents.length === 0) {
            throw new Error('User data not found in the database.');
        }

        return currentUser.documents[0];
    } catch (error) {
        console.error('Error fetching current user:', error);
        throw new Error('Unable to fetch current user details.');
    }
}

// Sign out the user account
export async function signOutAccount() {
    try {
        const session = await account.deleteSessions();
        return session;
    } catch (error) {
        console.error('Error during sign-out:', error);
        throw new Error('Sign-out failed.');
    }
}

// Create a new post
// Create a new post
export async function createPost(post: INewPost) {
  try {
      // Retrieve current user information (session check)
      const user = await account.get(); // Gets the current user's information

      // Check if the user object exists and contains a valid user ID
      if (!user || !user.$id) {
          throw new Error("User not authenticated or invalid session.");
      }

      console.log("Current User ID:", user.$id);  // Log the user ID

      // Upload file to Appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);

      if (!uploadedFile) throw new Error("File upload failed");

      console.log("Uploaded File:", uploadedFile);  // Log the uploaded file response

      // Get file URL for preview
      const fileUrl = await getFilePreview(uploadedFile.$id);
      console.log("File URL:", fileUrl);  // Log the file URL

      // Validate file URL length (max 2000 characters allowed)
      if (!fileUrl || fileUrl.length > 2000) {
          await deleteFile(uploadedFile.$id);
          throw new Error("Invalid file URL");
      }

      // Convert tags into an array (split by commas)
      const tags = post.tags?.replace(/ /g, "").split(",") || [];

      // Now create the post document in the database with the creator user ID
      const newPost = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.postCollectionId,
          ID.unique(),
          {
              creator: user.$id, // Ensure this matches the ID from the Users collection
              caption: post.caption,
              imageUrl: fileUrl,
              imageId: uploadedFile.$id,
              location: post.location,
              tags: tags,
          }
      );

      if (!newPost) {
          await deleteFile(uploadedFile.$id);
          throw new Error("Failed to create post in database.");
      }

      // Update the user's posts array by adding the new post ID to it
      await updateUserPosts(user.$id, newPost.$id);

      // Return the created post
      console.log("Post Created:", newPost);
  
      return newPost;
  } catch (error) {
      console.error("Error creating post:", error);
      throw error;  // Re-throw error to handle it outside
  }
}

// Update user's posts array to include the new post ID
// Update user's posts array to include the new post ID
async function updateUserPosts(userId: string, postId: string) {
  try {
      // Fetch the user document using listDocuments with Query.equal to make sure you get the correct document
      const currentUser = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          [Query.equal('accountId', userId)]
      );

      // Check if the user document exists
      if (!currentUser || currentUser.documents.length === 0) {
          throw new Error("User not found.");
      }

      const userDoc = currentUser.documents[0];  // Get the first document (assuming only one user)

      // If user has no posts, initialize it as an empty array
      const currentPosts = userDoc.posts || [];

      // Add the new post ID to the array
      currentPosts.push(postId);

      // Update the user's posts attribute in the Users collection
      const updatedUser = await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          userDoc.$id,  // Use the correct document ID
          {
              posts: currentPosts,
          }
      );

      console.log("User's posts updated:", updatedUser);
  } catch (error) {
      console.error("Error updating user posts:", error);
      throw new Error("Failed to update user posts.");
  }
}








// Upload a file to Appwrite storage
export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );

        return uploadedFile;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('File upload failed.');
    }
}

// Get file preview URL
export async function getFilePreview(fileId: string): Promise<string | null> {
  try {
      const fileUrl = storage.getFilePreview(
          appwriteConfig.storageId,
          fileId,
          2000,
          2000,
          ImageGravity.Top,
          100
      );

      if (typeof fileUrl !== "string" || fileUrl.length > 2000) {
          throw new Error("Invalid file preview URL");
      }

      return fileUrl;
  } catch (error) {
      console.error("Error generating file preview URL:", error);
      return null;
  }
}


// Delete a file from Appwrite storage
export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);
        return { status: 'ok' };
    } catch (error) {
        console.error('Error deleting file:', error);
        throw new Error('File deletion failed.');
    }
}

// Fetch recent posts
export async function getRecentPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(20)]
        );

        return posts;
    } catch (error) {
        console.error('Error fetching recent posts:', error);
        throw new Error('Unable to fetch recent posts.');
    }
}

// Like a post
export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            { likes: likesArray }
        );

        return updatedPost;
    } catch (error) {
        console.error('Error liking post:', error);
        throw new Error('Post like failed.');
    }
}

// Save a post
export async function savePost(userId: string, postId: string) {
    try {
        const savedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            { user: userId, posts: postId }
        );

        return savedPost;
    } catch (error) {
        // Log full error details
        console.log('User ID:', userId);
console.log('Post ID:', postId);
console.log('Payload:', { user: userId, posts: [postId] });

        console.error('Error saving post:', error);
        throw new Error('Failed to save post.');
    }
}


// Delete a saved post
export async function deleteSavedPost(savedRecordId: string) {
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId
        );

        return { status: "Ok" };
    } catch (error) {
        console.error('Error deleting saved post:', error);
        throw new Error('Failed to delete saved post.');
    }
}

// Fetch all users
export async function getUsers(limit?: number) {
    try {
        const queries: any[] = [Query.orderDesc("$createdAt")];
        if (limit) queries.push(Query.limit(limit));

        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            queries
        );

        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Unable to fetch users.');
    }
}


// Fetch posts along with creator details
export async function getRecentPostsWithCreators() {
  try {
    // Step 1: Fetch all posts
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    // Step 2: Fetch creator details for each post
    const enrichedPosts = await Promise.all(
      posts.documents.map(async (post) => {
        try {
          const userResponse = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", post.creator)] // Match the user by their accountId
          );

          if (userResponse.documents.length > 0) {
            const user = userResponse.documents[0];
            return { ...post, creator: { name: user.name, imageUrl: user.imageUrl || null } };
          } else {
            console.warn(`User not found for creator ID: ${post.creator}`);
            return { ...post, creator: { name: "Unknown User", imageUrl: null } };
          }
        } catch (error) {
          console.error(`Error fetching creator for post ${post.$id}:`, error);
          return { ...post, creator: { name: "Error fetching user", imageUrl: null } };
        }
      })
    );

    return enrichedPosts;
  } catch (error) {
    console.error("Error fetching posts with creators:", error);
    throw new Error("Unable to fetch posts with creators.");
  }
}
