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
  set: object;
}

export const saveData = async <T extends Document>({ model: ModelObject, params }: SaveParams<T>): Promise<T> => {
  const newObject = new ModelObject(params);
  await newObject.validate();
  return newObject.save();
};

export const findOneBy = async <T extends Document>({ model: ModelObject, condition, hiddenPropertiesToSelect }: FindByParams<T>): Promise<T | null> => {
  try {
    // @ts-ignore
    const finedObject = await ModelObject.findOne(condition)
      .select(hiddenPropertiesToSelect ? hiddenPropertiesToSelect.map((property) => `+${property}`) : '');
    return finedObject || null;
  } catch (e) {
    return null;
  }
};

export const deleteOnyBy = async <T extends Document>({ model: ModelObject, condition }: ByParams<T>): Promise<boolean> => {
  try {
    // @ts-ignore
    const deletion = await ModelObject.deleteOne(condition);
    return deletion.deletedCount! > 0;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return false;
  }
};

export const updateOneBy = async <T extends Document>({ model: ModelObject, condition, set }: UpdateByParams<T>): Promise<boolean> => {
  try {
    // @ts-ignore
    const update = await ModelObject.updateOne(condition, { $set: set, $inc: { __v: 1 } });
    return update.nModified > 0;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return false;
  }
};

export const updateManyBy = async <T extends Document>({ model: ModelObject, condition, set }: UpdateByParams<T>): Promise<boolean> => {
  try {
    // @ts-ignore
    const update = await ModelObject.updateMany(condition, { $set: set, $inc: { __v: 1 } });
    return update.nModified > 0;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return false;
  }
};

export const findManyBy = async <T extends Document>({ model: ModelObject, condition, hiddenPropertiesToSelect }: FindByParams<T>): Promise<T[]> => {
  try {
    // @ts-ignore
    return ModelObject.find(condition)
      .select(hiddenPropertiesToSelect ? hiddenPropertiesToSelect.map((property) => `+${property}`) : '');
  } catch (e) {
    return [];
  }
};
