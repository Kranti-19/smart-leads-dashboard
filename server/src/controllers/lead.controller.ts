import { Request, Response } from "express";

import Lead from "../models/lead.model";

import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";

import { AuthRequest } from "../middlewares/auth.middleware";

import { createLeadSchema } from "../validations/lead.validation";
import { updateLeadSchema } from "../validations/lead.validation";
import { Parser } from "json2csv";

export const createLead = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const validatedData = createLeadSchema.parse(req.body);

    const lead = await Lead.create({
      ...validatedData,
      createdBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  }
);

export const getAllLeads = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const status = req.query.status as string;

    const source = req.query.source as string;

    const search = req.query.search as string;

    const sort = req.query.sort as string;

    const query: Record<string, unknown> = {};

    if (status) {
      query.status = status;
    }

    if (source) {
      query.source = source;
    }

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },

        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    let sortOption = {};

    if (sort === "latest") {
      sortOption = { createdAt: -1 };
    }

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    const totalLeads = await Lead.countDocuments(query);

    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,

      results: leads.length,

      pagination: {
        total: totalLeads,
        page,
        limit,
        totalPages: Math.ceil(totalLeads / limit),
      },

      data: leads,
    });
  }
);

export const getLeadById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      throw new ApiError(404, "Lead not found");
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  }
);

export const updateLead = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validatedData = updateLeadSchema.parse(req.body);

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      throw new ApiError(404, "Lead not found");
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      validatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updatedLead,
    });
  }
);

export const deleteLead = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      throw new ApiError(404, "Lead not found");
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  }
);

export const exportLeadsToCSV = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const leads = await Lead.find().select(
      "name email status source createdAt"
    );

    const fields = [
      "name",
      "email",
      "status",
      "source",
      "createdAt",
    ];

    const json2csvParser = new Parser({ fields });

    const csv = json2csvParser.parse(leads);

    res.header("Content-Type", "text/csv");

    res.attachment("leads.csv");

    res.status(200).send(csv);
  }
);