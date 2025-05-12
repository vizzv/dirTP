/***
packet type :
	0 : DATA_TRANSFER
	1 : META
	2 : ACK

***/
class packet 
{
	constructor(packetId, index, data,version = 0,type)
	{
		this.packetId = packetId;
		this.index = index;
		this.data = data;
		this.version = version;
		this.type = type;
	}
}

class packetStore
{
 	constructor()
	{
		this.store = new Map();
	}

	push(newPacket)
	{
		var packet = this.store.get(newPacket.id);
		if(packet != null)
		{
			packet.add(newPacket);
			return true;
		}
		if(newPacket.id != null)
		{
			this.store.set(newPacket.id,new Set());
			this.store.get(newPacket.id).add(newPacket);
			return true;
		}

	}

	pop(packetId)
	{
		this.store.delete(packetId);
	}

	popFractionFromPacket(packetId,fractionIndex)
	{
		var packet = this.store.get(packetId);
		if(packet)
		{
			for (var fraction of packet) 
			{
  				if (fraction.index === fractionIndex)
				{
    					packet.delete(fraction);
    					break;
  				}
			}
		}
	}
	clear()
	{
		this.store = new Map();
	}
	clearPacket(packetId)
	{
		var packet = this.store.get(packetId);
		if(packet)
		{
			this.store.clear();
		}
	}
	
	get(packet)
	{
		return this.store.get(packet.id);
	}

	getFractionFromPacket(packetId,fractionIndex)
	{
		var packet = this.store.get(packetId);
		if(packet)
			{
				for (const fraction of packet) {
    					if (fraction.index === fractionIndex) {
      					return fraction;
    					}
  				}
			}
	}
	getAll()
	{
		return this.store;
	}
	
}

module.exports.packet = packet ;
module.exports.packetStore= packetStore ;
