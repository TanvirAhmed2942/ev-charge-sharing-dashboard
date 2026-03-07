import { baseApi } from "../baseApi";

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface FaqListMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

/** getAllFaqs response: paginated list */
export interface GetAllFaqsResponse {
  success: boolean;
  message?: string;
  meta: FaqListMeta;
  data: FaqItem[];
}

/** getFaqById response: single FAQ */
export interface GetFaqByIdResponse {
  success: boolean;
  message?: string;
  data: FaqItem;
}

export type UpdateFaqRequest = Partial<Pick<FaqItem, "question" | "answer">> & {
  _id: string;
};

export interface CreateFaqRequest {
  question: string;
  answer: string;
}

export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFaqs: builder.query<GetAllFaqsResponse, void>({
      query: () => ({
        url: "/faq",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              "Faq",
              ...result.data.map(({ _id }) => ({
                type: "Faq" as const,
                id: _id,
              })),
            ]
          : ["Faq"],
    }),
    getFaqById: builder.query<GetFaqByIdResponse, string>({
      query: (id) => ({
        url: `/faq/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Faq", id }],
    }),
    updateFaq: builder.mutation<GetFaqByIdResponse, UpdateFaqRequest>({
      query: (body) => ({
        url: `/faq/${body._id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _err, { _id }) => [
        { type: "Faq", id: _id },
        "Faq",
      ],
    }),
    createFaq: builder.mutation<GetFaqByIdResponse, CreateFaqRequest>({
      query: (body) => ({
        url: "/faq/create-faq",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Faq"],
    }),
    deleteFaq: builder.mutation<{ success: boolean; message?: string }, string>(
      {
        query: (id) => ({
          url: `/faq/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Faq"],
      },
    ),
  }),
  overrideExisting: true,
});

export const {
  useGetAllFaqsQuery,
  useGetFaqByIdQuery,
  useUpdateFaqMutation,
  useCreateFaqMutation,
  useDeleteFaqMutation,
} = faqApi;
