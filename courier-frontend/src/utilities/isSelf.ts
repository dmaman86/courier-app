import { AuthState, BaseEntity } from "@/models";

export const isSelf = <T extends BaseEntity>(
  item: T,
  auth: AuthState,
): boolean => {
  const isSame = (
    item: Partial<{ id: string | number; phoneNumber?: string }>,
  ): boolean => {
    return (
      item.id === auth.id &&
      !!item.phoneNumber &&
      item.phoneNumber === auth.phoneNumber
    );
  };

  return isSame(item as { id: string | number; phoneNumber?: string });
};
