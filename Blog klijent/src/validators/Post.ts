interface PostData
{
    title: string;
    description: string;
    content: string;
    coverImage: File | null
}

interface PostDataErrors
{
    errorsExist: boolean;
    titleError: string | undefined;
    descriptionError: string | undefined;
    contentError: string | undefined;
    coverImageError: string | undefined;
}

export function validatePost(postData: PostData): PostDataErrors
{
    let errors: PostDataErrors = {
        errorsExist: false,
        titleError: '',
        descriptionError: '',
        contentError: '',
        coverImageError: ''
    };

    if(postData.title.trim().length < 2)
    {
        errors.titleError = "Title must be at least 2 characters long";
        errors.errorsExist = true;
    }

    if(postData.description.trim().length < 2)
    {
        errors.descriptionError = "Description must be at least 2 characters long";
        errors.errorsExist = true;
    }

    if(postData.content.trim().length < 2)
    {
        errors.contentError = "Content must be at least 2 characters long";
        errors.errorsExist = true;
    }

    if(!postData.coverImage)
    {
        errors.coverImageError = "No cover image found";
        errors.errorsExist = true;
    }

    return errors;
}