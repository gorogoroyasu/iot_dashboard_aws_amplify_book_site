import { toast } from "react-toastify";
import { Device } from "../data/devices";
import { API } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api";
import { useQuery } from "@tanstack/react-query";
import {
  GetDeviceQuery,
  ListDevicesQuery,
  CreateDeviceMutation,
  UpdateDeviceMutation,
  DeleteDeviceMutation,
  CreateDeviceInput,
  UpdateDeviceInput,
} from "../../src/API";
import * as queries from "../../src/graphql/queries";
import * as mutations from "../../src/graphql/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFetchDevices = (): Device[] => {
  const { data: devices } = useQuery(["devices"], async () => {
    const { data } = (await API.graphql({
      query: queries.listDevices,
    })) as GraphQLResult<ListDevicesQuery>;
    return data?.listDevices?.items.flatMap((d) => (d === null ? [] : [d]));
  });
  return devices as Device[];
};

export const useFetchDevice = (id: string): Device => {
  const { data: device } = useQuery(["device"], async () => {
    const { data } = (await API.graphql({
      query: queries.getDevice,
      variables: { id },
    })) as GraphQLResult<GetDeviceQuery>;
    return data?.getDevice;
  });
  return device as Device;
};

export const useCreateDevice = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (input: CreateDeviceInput) => {
      const { data } = (await API.graphql({
        query: mutations.createDevice,
        variables: { input },
      })) as GraphQLResult<CreateDeviceMutation>;
      return data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["devices"]);
        toast.success(`${data?.createDevice?.name}を作成しました`);
        onSuccess();
      },
      onError: () => {
        toast.error("デバイスの作成に失敗しました");
      },
    }
  );
  return mutation.mutate;
};

export const useUpdateDevice = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (input: UpdateDeviceInput) => {
      const { data } = (await API.graphql({
        query: mutations.updateDevice,
        variables: { input },
      })) as GraphQLResult<UpdateDeviceMutation>;
      return data;
    },
    {
      onSuccess: (data) => {
        toast.success(`${data?.updateDevice?.name}を更新しました`);
        queryClient.invalidateQueries(["devices"]);
        queryClient.invalidateQueries(["device"]);
        onSuccess();
      },
      onError: () => {
        toast.error("デバイスの更新に失敗しました");
      },
    }
  );
  return mutation.mutate;
};

export const useDeleteDevice = (
  device: Device | null,
  onSuccess: () => void
) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async () => {
      const { data } = (await API.graphql({
        query: mutations.deleteDevice,
        variables: { input: { id: device?.id } },
      })) as GraphQLResult<DeleteDeviceMutation>;
      return data;
    },
    {
      onSuccess: (data) => {
        toast.success(`${data?.deleteDevice?.name}を削除しました`);
        queryClient.invalidateQueries(["devices"]);
        onSuccess();
      },
      onError: () => {
        toast.error("デバイスの削除に失敗しました");
      },
    }
  );
  return mutation.mutate;
};
