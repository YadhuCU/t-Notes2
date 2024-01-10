import { Note } from "../components/Note";
import { TimeSort } from "../components/TimeSort";
import { getAllTrashAPI } from "../services/allAPIs";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTrashToStore } from "../redux/addTrashSlice";

const Trash = () => {
  const { trashes } = useSelector((state) => state.trash);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllTrash();
  }, []);

  const getAllTrash = async () => {
    const { data } = await getAllTrashAPI();
    dispatch(addTrashToStore(data));
  };

  return (
    <div className=" container flex flex-col items-center lg:items-start px-2 py-4 mt-5">
      <h1 className="text-5xl">Trash</h1>
      <TimeSort />
      <div className="my-10 columns-1 gap-8 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5">
        {trashes?.map((item, index) => (
          <Note trash={true} key={index} data={item} />
        ))}
      </div>
    </div>
  );
};

export default Trash;
