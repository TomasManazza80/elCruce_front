import { authApi } from './authApi.js';

export const categoryApi = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => '/api/categories',
            providesTags: ['Category'],
        }),
        createCategory: builder.mutation({
            query: (name) => ({
                url: '/api/categories',
                method: 'POST',
                body: { name },
            }),
            invalidatesTags: ['Category'],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
} = categoryApi;
