import { InsertDriveFile as FileIcon } from "@mui/icons-material";
import { Button, Paper } from "@mui/material";
import { Tag, Typography } from "antd";
import React, { useState } from "react";
import { BsDashCircle } from "react-icons/bs";
import { IoIosEye } from "react-icons/io";

import { Link } from "react-router-dom";


const AwardProgressTable = ({ awardMilestone, application }: any) => {
  const transformToMarkdown = (text: string) => {
    return text.replace(/\\n/gi, "\n").replace(/\n/gi, "<br/>");
  };

  const CustomLink = ({ children, href }: any) => {
    return (
      <Link target="_blank" to={href} className="text-blue-400 no-underline">
        {children}
      </Link>
    );
  };
  const [openSubmissionGuideIndex, setOpenSubmissionGuideIndex] = React.useState(null);

  const handleOpenSubmissionGuide = (index: any) => {
    setOpenSubmissionGuideIndex(index === openSubmissionGuideIndex ? null : index);
  };

  if (!awardMilestone || awardMilestone.length === 0)
    return <p className="text-center font-semibold text-xl">No award milestone for this scholarship</p>;

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: "12px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        backgroundColor: "#fafafa",
      }}
    >

      {/* Column Headers */}
      <div
        style={{
          display: "flex",
          fontWeight: "bold",
          backgroundColor: "#f1f1f1",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <div style={{ flex: 1 }}>Milestone</div>
        <div style={{ flex: 1 }}>From Date</div>
        <div style={{ flex: 1 }}>To Date</div>
        <div style={{ flex: 1 }}>Amount</div>
        <div style={{ flex: 1 }}>Status</div>
        <div style={{ flex: 1 }}>Action</div>
      </div>

      {/* Award Milestone List */}
      {awardMilestone.map((award: any, index: any) => (

        <div
          key={award.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#f9f9f9",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "10px",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e3f2fd')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
        >

          {/* Milestone Header */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileIcon style={{ color: '#0d47a1' }} />
            <span>{`Milestone ${index + 1}`}</span>
          </div>
          <div style={{ flex: 1 }}>{new Date(award.fromDate).toLocaleDateString('en-US')}</div>
          <div style={{ flex: 1 }}>{new Date(award.toDate).toLocaleDateString('en-US')}</div>
          <div style={{ flex: 1, color: "#388e3c", fontWeight: "bold" }}>${award.amount}</div>
          {/* Status Section */}

          <div style={{ flex: 1 }}>
            {new Date(application.updatedAt) < new Date(award.toDate) && new Date(application.updatedAt) > new Date(award.fromDate) ? (
              <>
                {application.status === "Submitted" && (
                  <div className="flex gap-2 items-center">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-green-500 font-medium">Submitted</span>
                  </div>
                )}

                {application.status === "Approved" && (
                  <div className="flex gap-2 items-center">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                    </span>
                    <span className="text-sky-500 font-medium">Approved</span>
                  </div>
                )}

                {application.status === "NeedExtend" && (
                  <div className="flex gap-2 items-center">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                    </span>
                    <span className="text-yellow-500 font-medium">Need Extend</span>
                  </div>
                )}

                {application.status === "Awarded" && (
                  <div className="flex gap-2 items-center">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-green-500 font-medium">Awarded</span>
                  </div>
                )}
              </>

            ) : new Date(application.updatedAt) > new Date(award.toDate) ? (
              <div className="flex gap-2 items-center">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-green-500 font-medium">Awarded</span>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <BsDashCircle size={20} color="#9e9e9e" />
                <span className="text-gray-500 font-medium">Not Started</span>
              </div>
            )}
          </div>
          <div style={{ flex: 1, color: "#388e3c", fontWeight: "bold" }}>
            <Button
              onClick={() => handleOpenSubmissionGuide(index)}
              style={{
                backgroundColor: '#1e88e5',
                color: '#fff',
                borderRadius: '5px',
              }}
            >
              <IoIosEye style={{ marginRight: '7px' }} />
              Submission Guide
            </Button>
          </div>
        </div>
      ))}

      {openSubmissionGuideIndex !== null && (
        <Paper
          elevation={2}
          sx={{
            marginTop: "20px",
            padding: "20px",
            borderRadius: "12px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3 style={{ color: "#0d47a1", marginBottom: "15px", fontFamily: "Arial, sans-serif" }}>
            Submission Guides for Progress {openSubmissionGuideIndex + 1}
          </h3>

          {/* Required Files */}
          <div style={{ marginBottom: "15px" }}>
            <h4 style={{ color: "#0d47a1" }}>Required Files</h4>
            {awardMilestone[openSubmissionGuideIndex].awardMilestoneDocuments &&
              awardMilestone[openSubmissionGuideIndex].awardMilestoneDocuments.length > 0 ? (
              awardMilestone[openSubmissionGuideIndex].awardMilestoneDocuments.map((doc: any, idx: any) => (
                <Tag key={idx} color="magenta" style={{ marginRight: "5px" }}>
                  {doc.type}
                </Tag>
              ))
            ) : (
              <p>No required files</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <h4 style={{ color: "#0d47a1" }}>Notes</h4>
            <Typography>
              {awardMilestone[openSubmissionGuideIndex].note || "No notes for this award milestone"}
            </Typography>
          </div>
        </Paper>
      )}

    </Paper>
  );
};

export default AwardProgressTable;