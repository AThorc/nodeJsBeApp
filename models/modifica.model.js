module.exports = mongoose => {
    var schema = mongoose.Schema(
      {    
        servizioid:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Servizio"
        },
        clienteid:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cliente"
        },
        partnerid:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Partner"
        },
        legameid:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Legame"
        },
        userid:
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        username: String,
        data: Date,    
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Modifica = mongoose.model("modifica", schema);
    return Modifica;
  };