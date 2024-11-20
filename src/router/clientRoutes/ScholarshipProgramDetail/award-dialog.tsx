import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";

interface AwardDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    winningApplications: any[]
}

const AwardDialog = ({ isOpen, setIsOpen, winningApplications }: AwardDialogProps) => {
    const { id } = useParams<{ id: string }>();
   
    useEffect(() => {
        
    }, []);

      return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white p-6 rounded-lg shadow-lg w-1/2"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl mb-10">Award Milestones</h3>
                            <button onClick={() => setIsOpen(false)} className="text-xl">
                                &times;
                            </button>
                        </div>
                        <div className="flex flex-col gap-4">

                            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {(!winningApplications || !winningApplications.length) && <p>No winning applications</p>}

                            {winningApplications && winningApplications.length > 0 && winningApplications.map((application: any, index: number) => (
                                
                                <div key={index}>
                                    {/*JSON.stringify(application)*/}
                                     <div>
                                         <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                              <Avatar alt="Remy Sharp" src={application.applicant.avatarUrl??"https://github.com/shadcn.png"} />
                                            </ListItemAvatar>
                                            <ListItemText
                                              primary={application.applicant.username}
                                              secondary={
                                                <>
                                                  <Typography
                                                    component="span"
                                                    variant="body2"
                                                    sx={{ color: 'text.primary', display: 'inline' }}
                                                  >
                                                  {application.applicant.email}
                                                  </Typography>
                                                </>
                                              }
                                            />
                                            <Link target="_blank" to={`/funder/application/${application.id}`} className="text-sky-500 underline">
                                                View Award Progress
                                            </Link>
                                          </ListItem>
                                          <Divider variant="fullWidth" component="li" />
                                      </div>
                                </div>

                            ))}

                         </List>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
  }

  export default AwardDialog;
