import { useEffect, useMemo, useState, useRef, useCallback} from "react";
import {createUseStyles} from "react-jss";

import FilterBar from "../home/filter-bar/FilterBar";
import HomeTableHeader from "../home/home-table-heading";
import { ROUTE_HOME} from "../../utilities/constants";
import TasksAPI from "../../http/task.http";
import { 
  dateIsInRange,
  dateRenderer,
  groupByDate,
	isBeforeToday,
  groupByCustomDate,
  handleApiError
 } from "../../utilities/helpers";
import useError from "../../hooks/useError";
import Container from "../../components/Container";
import Row from "../../components/Row";
import Column from "../../components/Column";
import { TASK_MODEL } from "../../models";
import Task from "../../components/Task";
import EditTaskModal from "../home/EditTaskModal";
import {useWindowSize} from "../../hooks/useWindowSize";
import dayjs from 'dayjs'


const useStyles = createUseStyles(theme => ({
    taskBodyRoot: {
        paddingTop: 0,
        height: `calc(${window.innerHeight}px - 184px)`,
        overflow: "scroll",
        paddingBottom: 40,
        [theme.mediaQueries.lUp]: {
            paddingBottom: 16
        }
    },
    date: {
        margin:'1.5rem 0 .5rem 0',
        fontWeight: '800',
        fontSize: '.8rem'
    },
    loading: {
        textAlign: 'center'
    }

}))

const Completed = () => {
    const [searchInput, setSearchInput] = useState('');
    const [dateFilter, setDateFilters] = useState('');
    const [priority, setPriority] = useState(false);
    const [tasks, setTasks] = useState({});
    const [openedTask, setOpenedTask] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [indexPage, setIndexpage] = useState(1)
    const [isLoading, setIsLoading] = useState(false);
    const mainContainer = useRef();
    const showError = useError()

    const classes = useStyles();

    const {width} = useWindowSize()
    const isMobile = width < 600
    
    useEffect(()=> {
        fetchHistoryTasks()
    }, [])





    const fetchHistoryTasks = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const {data} = await TasksAPI.completedTasks(indexPage);
            const newTasks = groupByCustomDate(data.data)
            setTasks(prevItems=> ({...prevItems, ...newTasks}));
           /*TODO: increment indexPage and compare with data.last_page*/
            setIndexpage(prevIndex => {
                const modifiedValue = prevIndex +1
                return modifiedValue;
            })
           
        } catch (error) {
            handleApiError({
                error,
                handleGeneralError: showError
            })
        }
        setIsLoading(false);

    }



    const filteredTasks = useMemo(
      () => {
          const filtered = {}
          if(tasks){
              Object.keys(tasks).forEach(date => {
                  const filteredDate = tasks[date].filter(t => {
                      const isInDate = dateFilter ?
                          dateIsInRange(t[TASK_MODEL.date], dateFilter?.[0], dateFilter?.[1]) : true
                      const isInSearch = searchInput ? t[TASK_MODEL.description].includes(searchInput) : true
                      const isInPriority = priority ? t[TASK_MODEL.effort] === priority.value : true
                      return isInDate && isInSearch && isInPriority
                  })
                  if(filteredDate.length) filtered[date] = filteredDate
              })
          }
          return filtered
      },
      [tasks, dateFilter, searchInput, priority]
  )

    /**
     * Delete Task
     * @param task
     * @param index
     * @returns {Promise<void>}
     */
    const onDeleteTask = async (task,index) => {
			try {
					await TasksAPI.deleteTask(task[TASK_MODEL.id]);
					onDeleteItem(task[TASK_MODEL.date],index)
			} catch (error) {
					handleApiError({
							error,
							handleGeneralError: showError
					})
			}
	}
	const onDeleteItem = (key,index) => {
			let newTasks = tasks;

			newTasks[key].splice(index,1);
			setTasks({...newTasks});
	}


    /**
     * Edit task
     * @param oldTask
     * @param newTask
     * @returns {Promise<void>}
     */
    const onEditTask = async (oldTask,newTask) => {
			try {
					const {data} = await TasksAPI.editTask(newTask);
					onUpdateItem(oldTask,data)
					
			} catch (error) {
					handleApiError({
							error,
							handleGeneralError: showError
					})
			}
	}
	const onUpdateItem = (oldItem,updatedItem) => {
			let newTasks = tasks;
			const isDateChanged = updatedItem[TASK_MODEL.date] !== oldItem[TASK_MODEL.date] && !(isBeforeToday(oldItem[TASK_MODEL.date]) && isBeforeToday(updatedItem[TASK_MODEL.date]))
			const dateGroup = Object.keys(updatedItem[TASK_MODEL.date])

			/*date remain the same*/
			if(dateGroup.some(el=> el === updatedItem[TASK_MODEL.date])) {
				const taskToUpdateIndex = newTasks[updatedItem[TASK_MODEL.date]].findIndex(task => task[TASK_MODEL.id] === updatedItem[TASK_MODEL.id])
				newTasks[updatedItem[TASK_MODEL.date]][taskToUpdateIndex] = updatedItem
			}else {
				/*date change*/
				/*remove task in the date group*/
				newTasks[oldItem[TASK_MODEL.date]] = newTasks[oldItem[TASK_MODEL.date]].filter(task => task[TASK_MODEL.id] !== updatedItem[TASK_MODEL.id])

					/*date is already in the list*/
					if(updatedItem[TASK_MODEL.date] in newTasks) {
						newTasks[updatedItem[TASK_MODEL.date]].push(updatedItem)
				} else {
					/*date is not present in the list*/
						newTasks[updatedItem[TASK_MODEL.date]] = [updatedItem];
					}
				}

				if(!updatedItem.is_completed) {
					newTasks[oldItem[TASK_MODEL.date]] = newTasks[oldItem[TASK_MODEL.date]].filter(task => task[TASK_MODEL.id] !== updatedItem[TASK_MODEL.id])
				}
	

			setTasks({...newTasks});
	}

        const handleScroll = () => {
            let distanceFromTop = mainContainer.current.scrollHeight - mainContainer.current.scrollTop - mainContainer.current.clientHeight
            if (distanceFromTop < 1) {
                fetchHistoryTasks()
            }
          }

        useEffect(() => {
            mainContainer.current.addEventListener('scroll', handleScroll);
            //return () => mainContainer.current.removeEventListener('scroll', handleScroll);
          }, []);

   return <>
          <FilterBar
            onSearchHandler={setSearchInput}
            onDateChangeHandler={setDateFilters}
            dateFilter={dateFilter}
            onPriorityHandler={setPriority}
            navigation={{label: 'Todo', route: ROUTE_HOME}}
        />
        <HomeTableHeader />
        <Container className={classes.taskBodyRoot} ref={mainContainer}>
            <Row>
                <Column start={2} span={10}>
                    {filteredTasks && Object.keys(filteredTasks).map(date => 
                    <div key={date}>
                        <p className={classes.date}>{dayjs(date).format("DD-MM-YYYY")}</p>  
                        {filteredTasks[date].map((task, index)=> 
                        <Task task={task}
                        key={index}
                        index={index}
                        isLast={(tasks[date]?.length - 1 === index)}
                        onDeleteCb={onDeleteTask}
                        onUpdateCb={onEditTask}
                        onEditCb={() =>{
                                setOpenedTask(task)
                                setShowEditModal(true)
                                }}
                        /> )}
                    </div>
                    )}
                 </Column>   
           </Row>      
           {isLoading && <p className={classes.loading}>Loading...</p>}
        </Container>
        {showEditModal && !isMobile && (
            <EditTaskModal
                onClose={() => {
                    setShowEditModal(false)
                }}
                onUpdateCb={onEditTask}
                task={openedTask}
            />
        )}


    </>
}

export default Completed;