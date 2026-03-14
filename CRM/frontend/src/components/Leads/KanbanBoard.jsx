// src/components/Leads/KanbanBoard.jsx
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FiMail, FiMoreVertical, FiPhone, FiPlus } from "react-icons/fi";

const KanbanBoard = ({ leads, onLeadUpdate }) => {
  const [columns, setColumns] = useState({
    new: {
      id: "new",
      title: "New",
      color: "blue",
      items: leads.filter((l) => l.status === "new"),
    },
    contacted: {
      id: "contacted",
      title: "Contacted",
      color: "yellow",
      items: leads.filter((l) => l.status === "contacted"),
    },
    qualified: {
      id: "qualified",
      title: "Qualified",
      color: "purple",
      items: leads.filter((l) => l.status === "qualified"),
    },
    converted: {
      id: "converted",
      title: "Converted",
      color: "green",
      items: leads.filter((l) => l.status === "converted"),
    },
    lost: {
      id: "lost",
      title: "Lost",
      color: "red",
      items: leads.filter((l) => l.status === "lost"),
    },
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
      });
    } else {
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });

      // Update lead status
      onLeadUpdate(removed._id, { status: destination.droppableId });
    }
  };

  const getColumnColor = (color) => {
    const colors = {
      blue: "border-blue-500 bg-blue-50 dark:bg-blue-900/10",
      yellow: "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10",
      purple: "border-purple-500 bg-purple-50 dark:bg-purple-900/10",
      green: "border-green-500 bg-green-50 dark:bg-green-900/10",
      red: "border-red-500 bg-red-50 dark:bg-red-900/10",
    };
    return colors[color] || colors.blue;
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {Object.values(columns).map((column) => (
          <div
            key={column.id}
            className={`flex-shrink-0 w-80 rounded-xl border-t-4 ${getColumnColor(column.color)} bg-white dark:bg-gray-800 shadow-md`}
          >
            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {column.title}
                </h3>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400">
                  {column.items.length}
                </span>
              </div>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-4 min-h-[500px] transition-colors ${
                    snapshot.isDraggingOver
                      ? "bg-gray-50 dark:bg-gray-700/50"
                      : ""
                  }`}
                >
                  <AnimatePresence>
                    {column.items.map((item, index) => (
                      <Draggable
                        key={item._id}
                        draggableId={item._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              scale: snapshot.isDragging ? 1.05 : 1,
                            }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-3 border border-gray-200 dark:border-gray-700 ${
                              snapshot.isDragging
                                ? "shadow-lg ring-2 ring-primary-500"
                                : ""
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {item.firstName} {item.lastName}
                              </h4>
                              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <FiMoreVertical className="h-4 w-4" />
                              </button>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {item.company || "No Company"}
                            </p>

                            <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-500">
                              <div className="flex items-center">
                                <FiMail className="h-3 w-3 mr-1" />
                                <span className="truncate max-w-[100px]">
                                  {item.email}
                                </span>
                              </div>
                              {item.phone && (
                                <div className="flex items-center">
                                  <FiPhone className="h-3 w-3 mr-1" />
                                  <span>{item.phone}</span>
                                </div>
                              )}
                            </div>

                            {item.notes?.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  📝{" "}
                                  {item.notes[
                                    item.notes.length - 1
                                  ].content.substring(0, 50)}
                                  {item.notes[item.notes.length - 1].content
                                    .length > 50
                                    ? "..."
                                    : ""}
                                </p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {provided.placeholder}

                  {column.items.length === 0 && (
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Drop leads here
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>

            <div className="p-4 border-t dark:border-gray-700">
              <button className="w-full flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <FiPlus className="h-4 w-4" />
                <span>Add Lead</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
