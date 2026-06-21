import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AdminAnalytics, AssignPlanBody, AuthResponse, CountryCount, CreateLeadBody, CreatePlanBody, DashboardSummary, ErrorResponse, GetRecentLeadsParams, HealthStatus, Lead, LeadsPage, ListLeadsParams, ListPaymentsParams, ListUsersParams, LoginBody, MessageResponse, MonthlyRevenue, PaymentsPage, Plan, RegisterBody, StatusCount, UpdateLeadBody, UpdateLeadNotesBody, UpdateLeadStatusBody, UpdatePlanBody, UpdateUserBody, UpdateUserStatusBody, User, UserLead, UsersPage } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Register a new user
 */
export declare const getRegisterUrl: () => string;
export declare const register: (registerBody: RegisterBody, options?: RequestInit) => Promise<AuthResponse>;
export declare const getRegisterMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
        data: BodyType<RegisterBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
    data: BodyType<RegisterBody>;
}, TContext>;
export type RegisterMutationResult = NonNullable<Awaited<ReturnType<typeof register>>>;
export type RegisterMutationBody = BodyType<RegisterBody>;
export type RegisterMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Register a new user
 */
export declare const useRegister: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
        data: BodyType<RegisterBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof register>>, TError, {
    data: BodyType<RegisterBody>;
}, TContext>;
/**
 * @summary Login user
 */
export declare const getLoginUrl: () => string;
export declare const login: (loginBody: LoginBody, options?: RequestInit) => Promise<AuthResponse>;
export declare const getLoginMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginBody>;
}, TContext>;
export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>;
export type LoginMutationBody = BodyType<LoginBody>;
export type LoginMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Login user
 */
export declare const useLogin: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginBody>;
}, TContext>;
/**
 * @summary Logout user
 */
export declare const getLogoutUrl: () => string;
export declare const logout: (options?: RequestInit) => Promise<MessageResponse>;
export declare const getLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
export type LogoutMutationResult = NonNullable<Awaited<ReturnType<typeof logout>>>;
export type LogoutMutationError = ErrorType<unknown>;
/**
 * @summary Logout user
 */
export declare const useLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
/**
 * @summary Get current authenticated user
 */
export declare const getGetMeUrl: () => string;
export declare const getMe: (options?: RequestInit) => Promise<User>;
export declare const getGetMeQueryKey: () => readonly ["/api/auth/me"];
export declare const getGetMeQueryOptions: <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get current authenticated user
 */
export declare function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all users (admin only)
 */
export declare const getListUsersUrl: (params?: ListUsersParams) => string;
export declare const listUsers: (params?: ListUsersParams, options?: RequestInit) => Promise<UsersPage>;
export declare const getListUsersQueryKey: (params?: ListUsersParams) => readonly ["/api/users", ...ListUsersParams[]];
export declare const getListUsersQueryOptions: <TData = Awaited<ReturnType<typeof listUsers>>, TError = ErrorType<unknown>>(params?: ListUsersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListUsersQueryResult = NonNullable<Awaited<ReturnType<typeof listUsers>>>;
export type ListUsersQueryError = ErrorType<unknown>;
/**
 * @summary List all users (admin only)
 */
export declare function useListUsers<TData = Awaited<ReturnType<typeof listUsers>>, TError = ErrorType<unknown>>(params?: ListUsersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get user by ID
 */
export declare const getGetUserUrl: (userId: number) => string;
export declare const getUser: (userId: number, options?: RequestInit) => Promise<User>;
export declare const getGetUserQueryKey: (userId: number) => readonly [`/api/users/${number}`];
export declare const getGetUserQueryOptions: <TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<unknown>>(userId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetUserQueryResult = NonNullable<Awaited<ReturnType<typeof getUser>>>;
export type GetUserQueryError = ErrorType<unknown>;
/**
 * @summary Get user by ID
 */
export declare function useGetUser<TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<unknown>>(userId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update user
 */
export declare const getUpdateUserUrl: (userId: number) => string;
export declare const updateUser: (userId: number, updateUserBody: UpdateUserBody, options?: RequestInit) => Promise<User>;
export declare const getUpdateUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
        userId: number;
        data: BodyType<UpdateUserBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
    userId: number;
    data: BodyType<UpdateUserBody>;
}, TContext>;
export type UpdateUserMutationResult = NonNullable<Awaited<ReturnType<typeof updateUser>>>;
export type UpdateUserMutationBody = BodyType<UpdateUserBody>;
export type UpdateUserMutationError = ErrorType<unknown>;
/**
 * @summary Update user
 */
export declare const useUpdateUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
        userId: number;
        data: BodyType<UpdateUserBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateUser>>, TError, {
    userId: number;
    data: BodyType<UpdateUserBody>;
}, TContext>;
/**
 * @summary Activate or deactivate a user (admin only)
 */
export declare const getUpdateUserStatusUrl: (userId: number) => string;
export declare const updateUserStatus: (userId: number, updateUserStatusBody: UpdateUserStatusBody, options?: RequestInit) => Promise<User>;
export declare const getUpdateUserStatusMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateUserStatus>>, TError, {
        userId: number;
        data: BodyType<UpdateUserStatusBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateUserStatus>>, TError, {
    userId: number;
    data: BodyType<UpdateUserStatusBody>;
}, TContext>;
export type UpdateUserStatusMutationResult = NonNullable<Awaited<ReturnType<typeof updateUserStatus>>>;
export type UpdateUserStatusMutationBody = BodyType<UpdateUserStatusBody>;
export type UpdateUserStatusMutationError = ErrorType<unknown>;
/**
 * @summary Activate or deactivate a user (admin only)
 */
export declare const useUpdateUserStatus: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateUserStatus>>, TError, {
        userId: number;
        data: BodyType<UpdateUserStatusBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateUserStatus>>, TError, {
    userId: number;
    data: BodyType<UpdateUserStatusBody>;
}, TContext>;
/**
 * @summary Assign a plan to user (admin only)
 */
export declare const getAssignUserPlanUrl: (userId: number) => string;
export declare const assignUserPlan: (userId: number, assignPlanBody: AssignPlanBody, options?: RequestInit) => Promise<User>;
export declare const getAssignUserPlanMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof assignUserPlan>>, TError, {
        userId: number;
        data: BodyType<AssignPlanBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof assignUserPlan>>, TError, {
    userId: number;
    data: BodyType<AssignPlanBody>;
}, TContext>;
export type AssignUserPlanMutationResult = NonNullable<Awaited<ReturnType<typeof assignUserPlan>>>;
export type AssignUserPlanMutationBody = BodyType<AssignPlanBody>;
export type AssignUserPlanMutationError = ErrorType<unknown>;
/**
 * @summary Assign a plan to user (admin only)
 */
export declare const useAssignUserPlan: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof assignUserPlan>>, TError, {
        userId: number;
        data: BodyType<AssignPlanBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof assignUserPlan>>, TError, {
    userId: number;
    data: BodyType<AssignPlanBody>;
}, TContext>;
/**
 * @summary List leads accessible to the current user
 */
export declare const getListLeadsUrl: (params?: ListLeadsParams) => string;
export declare const listLeads: (params?: ListLeadsParams, options?: RequestInit) => Promise<LeadsPage>;
export declare const getListLeadsQueryKey: (params?: ListLeadsParams) => readonly ["/api/leads", ...ListLeadsParams[]];
export declare const getListLeadsQueryOptions: <TData = Awaited<ReturnType<typeof listLeads>>, TError = ErrorType<unknown>>(params?: ListLeadsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listLeads>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listLeads>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListLeadsQueryResult = NonNullable<Awaited<ReturnType<typeof listLeads>>>;
export type ListLeadsQueryError = ErrorType<unknown>;
/**
 * @summary List leads accessible to the current user
 */
export declare function useListLeads<TData = Awaited<ReturnType<typeof listLeads>>, TError = ErrorType<unknown>>(params?: ListLeadsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listLeads>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new lead (admin only)
 */
export declare const getCreateLeadUrl: () => string;
export declare const createLead: (createLeadBody: CreateLeadBody, options?: RequestInit) => Promise<Lead>;
export declare const getCreateLeadMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createLead>>, TError, {
        data: BodyType<CreateLeadBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createLead>>, TError, {
    data: BodyType<CreateLeadBody>;
}, TContext>;
export type CreateLeadMutationResult = NonNullable<Awaited<ReturnType<typeof createLead>>>;
export type CreateLeadMutationBody = BodyType<CreateLeadBody>;
export type CreateLeadMutationError = ErrorType<unknown>;
/**
 * @summary Create a new lead (admin only)
 */
export declare const useCreateLead: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createLead>>, TError, {
        data: BodyType<CreateLeadBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createLead>>, TError, {
    data: BodyType<CreateLeadBody>;
}, TContext>;
/**
 * @summary Get lead details
 */
export declare const getGetLeadUrl: (leadId: number) => string;
export declare const getLead: (leadId: number, options?: RequestInit) => Promise<Lead>;
export declare const getGetLeadQueryKey: (leadId: number) => readonly [`/api/leads/${number}`];
export declare const getGetLeadQueryOptions: <TData = Awaited<ReturnType<typeof getLead>>, TError = ErrorType<unknown>>(leadId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLead>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLead>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLeadQueryResult = NonNullable<Awaited<ReturnType<typeof getLead>>>;
export type GetLeadQueryError = ErrorType<unknown>;
/**
 * @summary Get lead details
 */
export declare function useGetLead<TData = Awaited<ReturnType<typeof getLead>>, TError = ErrorType<unknown>>(leadId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLead>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a lead (admin only)
 */
export declare const getUpdateLeadUrl: (leadId: number) => string;
export declare const updateLead: (leadId: number, updateLeadBody: UpdateLeadBody, options?: RequestInit) => Promise<Lead>;
export declare const getUpdateLeadMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateLead>>, TError, {
        leadId: number;
        data: BodyType<UpdateLeadBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateLead>>, TError, {
    leadId: number;
    data: BodyType<UpdateLeadBody>;
}, TContext>;
export type UpdateLeadMutationResult = NonNullable<Awaited<ReturnType<typeof updateLead>>>;
export type UpdateLeadMutationBody = BodyType<UpdateLeadBody>;
export type UpdateLeadMutationError = ErrorType<unknown>;
/**
 * @summary Update a lead (admin only)
 */
export declare const useUpdateLead: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateLead>>, TError, {
        leadId: number;
        data: BodyType<UpdateLeadBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateLead>>, TError, {
    leadId: number;
    data: BodyType<UpdateLeadBody>;
}, TContext>;
/**
 * @summary Delete a lead (admin only)
 */
export declare const getDeleteLeadUrl: (leadId: number) => string;
export declare const deleteLead: (leadId: number, options?: RequestInit) => Promise<MessageResponse>;
export declare const getDeleteLeadMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteLead>>, TError, {
        leadId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteLead>>, TError, {
    leadId: number;
}, TContext>;
export type DeleteLeadMutationResult = NonNullable<Awaited<ReturnType<typeof deleteLead>>>;
export type DeleteLeadMutationError = ErrorType<unknown>;
/**
 * @summary Delete a lead (admin only)
 */
export declare const useDeleteLead: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteLead>>, TError, {
        leadId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteLead>>, TError, {
    leadId: number;
}, TContext>;
/**
 * @summary Update lead status for the current user
 */
export declare const getUpdateLeadStatusUrl: (leadId: number) => string;
export declare const updateLeadStatus: (leadId: number, updateLeadStatusBody: UpdateLeadStatusBody, options?: RequestInit) => Promise<UserLead>;
export declare const getUpdateLeadStatusMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateLeadStatus>>, TError, {
        leadId: number;
        data: BodyType<UpdateLeadStatusBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateLeadStatus>>, TError, {
    leadId: number;
    data: BodyType<UpdateLeadStatusBody>;
}, TContext>;
export type UpdateLeadStatusMutationResult = NonNullable<Awaited<ReturnType<typeof updateLeadStatus>>>;
export type UpdateLeadStatusMutationBody = BodyType<UpdateLeadStatusBody>;
export type UpdateLeadStatusMutationError = ErrorType<unknown>;
/**
 * @summary Update lead status for the current user
 */
export declare const useUpdateLeadStatus: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateLeadStatus>>, TError, {
        leadId: number;
        data: BodyType<UpdateLeadStatusBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateLeadStatus>>, TError, {
    leadId: number;
    data: BodyType<UpdateLeadStatusBody>;
}, TContext>;
/**
 * @summary Update notes for a lead
 */
export declare const getUpdateLeadNotesUrl: (leadId: number) => string;
export declare const updateLeadNotes: (leadId: number, updateLeadNotesBody: UpdateLeadNotesBody, options?: RequestInit) => Promise<UserLead>;
export declare const getUpdateLeadNotesMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateLeadNotes>>, TError, {
        leadId: number;
        data: BodyType<UpdateLeadNotesBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateLeadNotes>>, TError, {
    leadId: number;
    data: BodyType<UpdateLeadNotesBody>;
}, TContext>;
export type UpdateLeadNotesMutationResult = NonNullable<Awaited<ReturnType<typeof updateLeadNotes>>>;
export type UpdateLeadNotesMutationBody = BodyType<UpdateLeadNotesBody>;
export type UpdateLeadNotesMutationError = ErrorType<unknown>;
/**
 * @summary Update notes for a lead
 */
export declare const useUpdateLeadNotes: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateLeadNotes>>, TError, {
        leadId: number;
        data: BodyType<UpdateLeadNotesBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateLeadNotes>>, TError, {
    leadId: number;
    data: BodyType<UpdateLeadNotesBody>;
}, TContext>;
/**
 * @summary List all subscription plans
 */
export declare const getListPlansUrl: () => string;
export declare const listPlans: (options?: RequestInit) => Promise<Plan[]>;
export declare const getListPlansQueryKey: () => readonly ["/api/plans"];
export declare const getListPlansQueryOptions: <TData = Awaited<ReturnType<typeof listPlans>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPlans>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPlans>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPlansQueryResult = NonNullable<Awaited<ReturnType<typeof listPlans>>>;
export type ListPlansQueryError = ErrorType<unknown>;
/**
 * @summary List all subscription plans
 */
export declare function useListPlans<TData = Awaited<ReturnType<typeof listPlans>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPlans>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new plan (admin only)
 */
export declare const getCreatePlanUrl: () => string;
export declare const createPlan: (createPlanBody: CreatePlanBody, options?: RequestInit) => Promise<Plan>;
export declare const getCreatePlanMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPlan>>, TError, {
        data: BodyType<CreatePlanBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createPlan>>, TError, {
    data: BodyType<CreatePlanBody>;
}, TContext>;
export type CreatePlanMutationResult = NonNullable<Awaited<ReturnType<typeof createPlan>>>;
export type CreatePlanMutationBody = BodyType<CreatePlanBody>;
export type CreatePlanMutationError = ErrorType<unknown>;
/**
 * @summary Create a new plan (admin only)
 */
export declare const useCreatePlan: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPlan>>, TError, {
        data: BodyType<CreatePlanBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createPlan>>, TError, {
    data: BodyType<CreatePlanBody>;
}, TContext>;
/**
 * @summary Update a plan (admin only)
 */
export declare const getUpdatePlanUrl: (planId: number) => string;
export declare const updatePlan: (planId: number, updatePlanBody: UpdatePlanBody, options?: RequestInit) => Promise<Plan>;
export declare const getUpdatePlanMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePlan>>, TError, {
        planId: number;
        data: BodyType<UpdatePlanBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updatePlan>>, TError, {
    planId: number;
    data: BodyType<UpdatePlanBody>;
}, TContext>;
export type UpdatePlanMutationResult = NonNullable<Awaited<ReturnType<typeof updatePlan>>>;
export type UpdatePlanMutationBody = BodyType<UpdatePlanBody>;
export type UpdatePlanMutationError = ErrorType<unknown>;
/**
 * @summary Update a plan (admin only)
 */
export declare const useUpdatePlan: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePlan>>, TError, {
        planId: number;
        data: BodyType<UpdatePlanBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updatePlan>>, TError, {
    planId: number;
    data: BodyType<UpdatePlanBody>;
}, TContext>;
/**
 * @summary Delete a plan (admin only)
 */
export declare const getDeletePlanUrl: (planId: number) => string;
export declare const deletePlan: (planId: number, options?: RequestInit) => Promise<MessageResponse>;
export declare const getDeletePlanMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePlan>>, TError, {
        planId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deletePlan>>, TError, {
    planId: number;
}, TContext>;
export type DeletePlanMutationResult = NonNullable<Awaited<ReturnType<typeof deletePlan>>>;
export type DeletePlanMutationError = ErrorType<unknown>;
/**
 * @summary Delete a plan (admin only)
 */
export declare const useDeletePlan: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePlan>>, TError, {
        planId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deletePlan>>, TError, {
    planId: number;
}, TContext>;
/**
 * @summary List payment history for the current user (or all users for admin)
 */
export declare const getListPaymentsUrl: (params?: ListPaymentsParams) => string;
export declare const listPayments: (params?: ListPaymentsParams, options?: RequestInit) => Promise<PaymentsPage>;
export declare const getListPaymentsQueryKey: (params?: ListPaymentsParams) => readonly ["/api/payments", ...ListPaymentsParams[]];
export declare const getListPaymentsQueryOptions: <TData = Awaited<ReturnType<typeof listPayments>>, TError = ErrorType<unknown>>(params?: ListPaymentsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPayments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPayments>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPaymentsQueryResult = NonNullable<Awaited<ReturnType<typeof listPayments>>>;
export type ListPaymentsQueryError = ErrorType<unknown>;
/**
 * @summary List payment history for the current user (or all users for admin)
 */
export declare function useListPayments<TData = Awaited<ReturnType<typeof listPayments>>, TError = ErrorType<unknown>>(params?: ListPaymentsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPayments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get dashboard summary stats for the current user
 */
export declare const getGetDashboardSummaryUrl: () => string;
export declare const getDashboardSummary: (options?: RequestInit) => Promise<DashboardSummary>;
export declare const getGetDashboardSummaryQueryKey: () => readonly ["/api/analytics/dashboard"];
export declare const getGetDashboardSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardSummary>>>;
export type GetDashboardSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get dashboard summary stats for the current user
 */
export declare function useGetDashboardSummary<TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get admin-level analytics (admin only)
 */
export declare const getGetAdminAnalyticsUrl: () => string;
export declare const getAdminAnalytics: (options?: RequestInit) => Promise<AdminAnalytics>;
export declare const getGetAdminAnalyticsQueryKey: () => readonly ["/api/analytics/admin"];
export declare const getGetAdminAnalyticsQueryOptions: <TData = Awaited<ReturnType<typeof getAdminAnalytics>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminAnalytics>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminAnalytics>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminAnalyticsQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminAnalytics>>>;
export type GetAdminAnalyticsQueryError = ErrorType<unknown>;
/**
 * @summary Get admin-level analytics (admin only)
 */
export declare function useGetAdminAnalytics<TData = Awaited<ReturnType<typeof getAdminAnalytics>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminAnalytics>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get lead counts grouped by country
 */
export declare const getGetLeadsByCountryUrl: () => string;
export declare const getLeadsByCountry: (options?: RequestInit) => Promise<CountryCount[]>;
export declare const getGetLeadsByCountryQueryKey: () => readonly ["/api/analytics/leads-by-country"];
export declare const getGetLeadsByCountryQueryOptions: <TData = Awaited<ReturnType<typeof getLeadsByCountry>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLeadsByCountry>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLeadsByCountry>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLeadsByCountryQueryResult = NonNullable<Awaited<ReturnType<typeof getLeadsByCountry>>>;
export type GetLeadsByCountryQueryError = ErrorType<unknown>;
/**
 * @summary Get lead counts grouped by country
 */
export declare function useGetLeadsByCountry<TData = Awaited<ReturnType<typeof getLeadsByCountry>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLeadsByCountry>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get lead counts grouped by status for the current user
 */
export declare const getGetLeadsByStatusUrl: () => string;
export declare const getLeadsByStatus: (options?: RequestInit) => Promise<StatusCount[]>;
export declare const getGetLeadsByStatusQueryKey: () => readonly ["/api/analytics/leads-by-status"];
export declare const getGetLeadsByStatusQueryOptions: <TData = Awaited<ReturnType<typeof getLeadsByStatus>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLeadsByStatus>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLeadsByStatus>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLeadsByStatusQueryResult = NonNullable<Awaited<ReturnType<typeof getLeadsByStatus>>>;
export type GetLeadsByStatusQueryError = ErrorType<unknown>;
/**
 * @summary Get lead counts grouped by status for the current user
 */
export declare function useGetLeadsByStatus<TData = Awaited<ReturnType<typeof getLeadsByStatus>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLeadsByStatus>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get most recently added leads
 */
export declare const getGetRecentLeadsUrl: (params?: GetRecentLeadsParams) => string;
export declare const getRecentLeads: (params?: GetRecentLeadsParams, options?: RequestInit) => Promise<Lead[]>;
export declare const getGetRecentLeadsQueryKey: (params?: GetRecentLeadsParams) => readonly ["/api/analytics/recent-leads", ...GetRecentLeadsParams[]];
export declare const getGetRecentLeadsQueryOptions: <TData = Awaited<ReturnType<typeof getRecentLeads>>, TError = ErrorType<unknown>>(params?: GetRecentLeadsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecentLeads>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRecentLeads>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRecentLeadsQueryResult = NonNullable<Awaited<ReturnType<typeof getRecentLeads>>>;
export type GetRecentLeadsQueryError = ErrorType<unknown>;
/**
 * @summary Get most recently added leads
 */
export declare function useGetRecentLeads<TData = Awaited<ReturnType<typeof getRecentLeads>>, TError = ErrorType<unknown>>(params?: GetRecentLeadsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecentLeads>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get revenue aggregated by month (admin only)
 */
export declare const getGetRevenueByMonthUrl: () => string;
export declare const getRevenueByMonth: (options?: RequestInit) => Promise<MonthlyRevenue[]>;
export declare const getGetRevenueByMonthQueryKey: () => readonly ["/api/analytics/revenue-by-month"];
export declare const getGetRevenueByMonthQueryOptions: <TData = Awaited<ReturnType<typeof getRevenueByMonth>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRevenueByMonth>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRevenueByMonth>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRevenueByMonthQueryResult = NonNullable<Awaited<ReturnType<typeof getRevenueByMonth>>>;
export type GetRevenueByMonthQueryError = ErrorType<unknown>;
/**
 * @summary Get revenue aggregated by month (admin only)
 */
export declare function useGetRevenueByMonth<TData = Awaited<ReturnType<typeof getRevenueByMonth>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRevenueByMonth>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map