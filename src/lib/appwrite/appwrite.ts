import { databases } from "./config"; // Import your appwriteConfig
import { Models, Query } from "appwrite";
import { appwriteConfig } from "./config";

const getUserByCreatorId = async (creatorId: string): Promise<Models.Document | null> => {
    if (!creatorId) {
        console.error('Creator ID (accountId) is required');
        return null;
    }

    try {
        // Query the Users collection to find the user with the accountId field
        const response = await databases.listDocuments(
            appwriteConfig.databaseId, 
            appwriteConfig.userCollectionId, 
            [
                Query.equal('accountId', creatorId)  // Search for user by accountId field
            ]
        );

        // Check if a document is found
        if (response.documents.length > 0) {
            return response.documents[0];  // Return the first matching document
        } else {
            console.error('No user found with the given accountId');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;  // Return null if there is an error fetching user data
    }
};

export default getUserByCreatorId;