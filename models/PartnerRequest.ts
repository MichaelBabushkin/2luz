import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPartnerRequest extends Document {
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const PartnerRequestSchema: Schema = new Schema(
  {
    fromUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    toUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' 
    },
  },
  { timestamps: true }
);

// Index to prevent duplicate pending requests
PartnerRequestSchema.index({ fromUserId: 1, toUserId: 1, status: 1 });

// Check if model already exists to prevent overwrite error in dev
const PartnerRequest: Model<IPartnerRequest> = 
  mongoose.models.PartnerRequest || mongoose.model<IPartnerRequest>('PartnerRequest', PartnerRequestSchema);

export default PartnerRequest;
