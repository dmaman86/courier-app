import React, { useMemo, useState } from "react";
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";

import { BaseEntity, ItemsTableProps } from "@/models";
import { ItemInlineForm } from "./ItemInlineForm";

type Order = "asc" | "desc";

const descendingComparator = <T extends BaseEntity>(
  a: T,
  b: T,
  getValue: (item: T) => any,
): number => {
  const aValue = getValue(a);
  const bValue = getValue(b);

  if (aValue < bValue) {
    return -1;
  }
  if (aValue > bValue) {
    return 1;
  }
  return 0;
};

const getComparator = <T extends BaseEntity>(
  order: Order,
  getValue: (item: T) => any,
): ((a: T, b: T) => number) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, getValue)
    : (a, b) => -descendingComparator(a, b, getValue);
};

export const ItemsTable = <T extends BaseEntity>({
  items,
  columns,
  mapItemRow,
  actions,
  expansion,
  formInline,
  size,
}: ItemsTableProps<T>) => {
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

  const showActions = actions?.display ?? false;

  const handleSort = (key: string) => {
    if (orderBy === key) {
      setOrderDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(key);
      setOrderDirection("asc");
    }
  };

  const sortedItems = useMemo(() => {
    if (!orderBy) return items;

    const column = columns.find((col) => col.key === orderBy);
    if (!column) return items;

    const getValue = column.sortedValue
      ? column.sortedValue
      : (item: T) => item[orderBy as keyof T];

    return [...items].sort(getComparator(orderDirection, getValue));
  }, [items, orderBy, orderDirection, columns]);

  return (
    <TableContainer sx={{ mt: 2, mb: 2, padding: 2 }}>
      <Table size={size} sx={{ minWidth: 650 }} aria-label="items table">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.key}
                sortDirection={
                  col.sortable && orderBy === col.key ? orderDirection : false
                }
              >
                {col.sortable ? (
                  <Tooltip
                    title={
                      orderBy === col.key
                        ? orderDirection === "asc"
                          ? "Sorted ascending"
                          : "Sorted descending"
                        : ""
                    }
                    disableHoverListener={orderBy !== col.key}
                    arrow
                  >
                    <TableSortLabel
                      active={orderBy === col.key}
                      direction={orderBy === col.key ? orderDirection : "asc"}
                      onClick={() =>
                        col.sortable && handleSort(col.key.toString())
                      }
                    >
                      {col.label}
                      {orderBy === col.key && (
                        <Box component="span" sx={visuallyHidden}>
                          {orderDirection === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      )}
                    </TableSortLabel>
                  </Tooltip>
                ) : (
                  col.label
                )}
              </TableCell>
            ))}
            {showActions && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedItems.map((item) => (
            <React.Fragment key={item.id}>
              <TableRow
                hover
                onClick={() => expansion?.onRowClick(item)}
                style={{
                  cursor: expansion?.isExpandable?.(item)
                    ? "pointer"
                    : "default",
                }}
              >
                {mapItemRow(item).map((col) => (
                  <TableCell key={`${item.id}-${col.key}`}>
                    {col.content}
                  </TableCell>
                ))}
                {showActions && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Stack spacing={2} direction="row">
                      {actions && actions.onEdit && (
                        <Tooltip title="Edit">
                          <IconButton
                            color="warning"
                            onClick={() => actions.onEdit(item.id!)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {actions?.onDelete &&
                        (!actions?.canDelete || actions.canDelete(item)) && (
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={() => actions.onDelete(item.id!)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                    </Stack>
                  </TableCell>
                )}
              </TableRow>

              {expansion &&
                expansion.isExpandable?.(item) &&
                expansion.isOpen(item.id!) &&
                !expansion.displayForm && (
                  <TableRow>
                    <TableCell colSpan={columns.length + (showActions ? 1 : 0)}>
                      <Paper variant="outlined" sx={{ padding: 2 }}>
                        {expansion.expandContent?.(item.id!)}
                      </Paper>
                    </TableCell>
                  </TableRow>
                )}
              {formInline &&
                formInline.id === item.id &&
                expansion &&
                expansion.displayForm && (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1}>
                      <ItemInlineForm
                        id={item.id}
                        itemForm={formInline.itemForm}
                        onClose={formInline.onClose}
                        onSubmit={formInline.onSubmit}
                      />
                    </TableCell>
                  </TableRow>
                )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
