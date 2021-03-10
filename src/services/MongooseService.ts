/* eslint-disable @typescript-eslint/ban-types */
import { Document, Model } from 'mongoose';

type ModelParams<T extends Document> = {
  model: Model<T>;
}

type ByParams<T extends Document> = ModelParams<T> & {
  condition: Record<string, number | string | boolean>;
};

type FindByParams<T extends Document> = ByParams<T> & {
  hiddenPropertiesToSelect?: Array<string>;
};

type SaveParams<T extends Document> = ModelParams<T> & {
  params: object;
}

type UpdateByParams<T extends Document> = ByParams<T> & {
  update: object;
}

export const findOneBy = async <T extends Document>({ model: ModelObject, condition, hiddenPropertiesToSelect }: FindByParams<T>): Promise<T | null> => {
  try {
    // @ts-ignore
    const objectFound = await ModelObject.findOne(condition)
      .select(hiddenPropertiesToSelect ? hiddenPropertiesToSelect.map((property) => `+${property}`) : '');
    return objectFound || null;
  } catch (e) {
    return null;
  }
};

export const findManyBy = async <T extends Document>({ model: ModelObject, condition, hiddenPropertiesToSelect }: FindByParams<T>): Promise<T[] | null> => {
  try {
    // @ts-ignore
    return ModelObject.find(condition)
      .select(hiddenPropertiesToSelect ? hiddenPropertiesToSelect.map((property) => `+${property}`) : '');
  } catch (e) {
    return null;
  }
};

export const updateOneBy = async <T extends Document>({ model: ModelObject, condition, update }: UpdateByParams<T>): Promise<T | null> => {
  try {
    // @ts-ignore
    return await ModelObject.findOneAndUpdate(condition, update);
  } catch (e) {
    return null;
  }
};

export const updateManyBy = async <T extends Document>({ model: ModelObject, condition, update }: UpdateByParams<T>): Promise<T | null> => {
  try {
    // @ts-ignore
    const updatedObject = await ModelObject.updateMany(condition, { $set: update, $inc: { __v: 1 } }); // TODO: implement incrementation

    // @ts-ignore
    return findManyBy<typeof ModelObject>({ model: ModelObject, condition });
  } catch (e) {
    return null;
  }
};

export const saveData = async <T extends Document>({ model: ModelObject, params }: SaveParams<T>): Promise<T | null> => {
  const newObject = new ModelObject(params);
  await newObject.validate();
  await newObject.save();

  // @ts-ignore
  return findOneBy<typeof ModelObject>({ model: ModelObject, condition: { _id: newObject._id } });
};

export const deleteOnyBy = async <T extends Document>({ model: ModelObject, condition }: ByParams<T>): Promise<boolean> => {
  try {
    // @ts-ignore
    const deleteResult = await ModelObject.deleteOne(condition);
    return deleteResult.deletedCount! > 0;
  } catch (e) {
    return false;
  }
};

export const deleteManyBy = async <T extends Document>({ model: ModelObject, condition }: ByParams<T>): Promise<boolean> => {
  try {
    // @ts-ignore
    const deleteResult = await ModelObject.deleteMany(condition);
    return deleteResult.deletedCount! > 0;
  } catch (e) {
    return false;
  }
};
