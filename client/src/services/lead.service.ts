import axiosInstance from "../api/axios";

interface GetLeadsParams {
  token: string;

  search?: string;

  status?: string;

  source?: string;

  page?: number;
}

export const getLeads = async ({
  
  token,
  search = "",
  status = "",
  source = "",
  page = 1,

}: GetLeadsParams) => {
  const response = await axiosInstance.get(
    `/leads?search=${search}&status=${status}&source=${source}&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

interface CreateLeadData {
  name: string;

  email: string;

  status: string;

  source: string;
}

export const createLead = async (
  token: string,
  data: CreateLeadData
) => {
  const response = await axiosInstance.post(
    "/leads",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateLead = async (
  token: string,
  id: string,
  data: {
    name: string;
    email: string;
    status: string;
    source: string;
  }
) => {
  const response = await axiosInstance.put(
    `/leads/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteLead = async (
  token: string,
  id: string
) => {
  const response = await axiosInstance.delete(
    `/leads/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};